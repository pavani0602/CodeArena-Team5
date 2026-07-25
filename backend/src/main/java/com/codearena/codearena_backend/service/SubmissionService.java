package com.codearena.codearena_backend.service;

import com.codearena.codearena_backend.dto.SubmissionRequest;
import com.codearena.codearena_backend.entity.Problem;
import com.codearena.codearena_backend.entity.Submission;
import com.codearena.codearena_backend.entity.SubmissionResult;
import com.codearena.codearena_backend.entity.TestCase;
import com.codearena.codearena_backend.entity.User;
import com.codearena.codearena_backend.enumtype.SubmissionStatus;
import com.codearena.codearena_backend.judge.JudgeResult;
import com.codearena.codearena_backend.judge.JudgeService;
import com.codearena.codearena_backend.judge.JudgeVerdict;
import com.codearena.codearena_backend.repository.ProblemRepository;
import com.codearena.codearena_backend.repository.SubmissionRepository;
import com.codearena.codearena_backend.repository.SubmissionResultRepository;
import com.codearena.codearena_backend.repository.TestCaseRepository;
import com.codearena.codearena_backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class SubmissionService {

    private static final int MAX_SUBMISSIONS_PER_MINUTE = 5000;

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final TestCaseRepository testCaseRepository;
    private final JudgeService judgeService;
    private final SubmissionResultRepository submissionResultRepository;
    private final LeaderboardService leaderboardService;

    public SubmissionService(
            SubmissionRepository submissionRepository,
            ProblemRepository problemRepository,
            UserRepository userRepository,
            TestCaseRepository testCaseRepository,
            JudgeService judgeService,
            SubmissionResultRepository submissionResultRepository,
            LeaderboardService leaderboardService
    ) {
        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
        this.testCaseRepository = testCaseRepository;
        this.judgeService = judgeService;
        this.submissionResultRepository = submissionResultRepository;
        this.leaderboardService = leaderboardService;
    }

    @Transactional(rollbackFor = Exception.class)
    public Submission createSubmission(Long problemId, String username, SubmissionRequest request) {

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        User user = userRepository.findByUsername(username)
                .orElseGet(() -> {
                    User u = new User();
                    u.setUsername(username);
                    u.setEmail(username + "@codearena.com");
                    u.setPasswordHash("password123");
                    u.setRole(com.codearena.codearena_backend.enumtype.UserRole.USER);
                    return userRepository.save(u);
                });

        LocalDateTime oneMinuteAgo = LocalDateTime.now().minusMinutes(1);

        long recentSubmissionCount =
                submissionRepository.countByUserIdAndProblemIdAndSubmittedAtAfter(
                        user.getId(),
                        problem.getId(),
                        oneMinuteAgo
                );

        if (recentSubmissionCount >= MAX_SUBMISSIONS_PER_MINUTE) {
            throw new RuntimeException("Submission limit exceeded. Please try again after some time.");
        }

        Submission submission = new Submission();
        submission.setProblem(problem);
        submission.setUser(user);
        submission.setLanguage(request.getLanguage());
        submission.setCode(request.getCode());
        submission.setStatus(SubmissionStatus.PENDING);

        submission = submissionRepository.save(submission);

        List<TestCase> testCases = testCaseRepository.findByProblemId(problemId);

        if (testCases.isEmpty()) {
            submission.setStatus(SubmissionStatus.RUNTIME_ERROR);
            return submissionRepository.save(submission);
        }

        boolean allPassed = true;
        String firstFailureStatus = null;
        List<SubmissionResult> savedResults = new ArrayList<>();

        for (TestCase testCase : testCases) {

            JudgeResult judgeResult = judgeService.judge(problem, testCase, request.getLanguage(), request.getCode());

            SubmissionResult result = new SubmissionResult();
            result.setSubmission(submission);
            result.setTestCase(testCase);
            result.setInputData(testCase.getInputData());
            result.setExpectedOutput(judgeResult.getExpectedOutput());
            result.setActualOutput(judgeResult.getActualOutput());
            result.setErrorMessage(judgeResult.getErrorMessage());
            result.setExecutionTimeMs(judgeResult.getExecutionTimeMs());

            if (judgeResult.getVerdict() != JudgeVerdict.ACCEPTED) {
                result.setStatus(judgeResult.getVerdict().name());
                result.setPassed(false);
                allPassed = false;
                if (firstFailureStatus == null) {
                    firstFailureStatus = judgeResult.getVerdict().name();
                }
            } else {
                result.setStatus("PASSED");
                result.setPassed(true);
            }

            savedResults.add(submissionResultRepository.save(result));
        }

        submission.setResults(savedResults);

        if (allPassed) {
            boolean alreadySolved = submissionRepository.existsByUserIdAndProblemIdAndStatus(
                    user.getId(),
                    problem.getId(),
                    SubmissionStatus.ACCEPTED
            );
            submission.setStatus(SubmissionStatus.ACCEPTED);
            leaderboardService.updateLeaderboard(user, true, !alreadySolved);
        } else if ("WRONG_ANSWER".equals(firstFailureStatus)) {
            submission.setStatus(SubmissionStatus.WRONG_ANSWER);
            leaderboardService.updateLeaderboard(user, false, false);
        } else if (firstFailureStatus != null) {
            submission.setStatus(convertStatus(firstFailureStatus));
            leaderboardService.updateLeaderboard(user, false, false);
        } else {
            submission.setStatus(SubmissionStatus.WRONG_ANSWER);
            leaderboardService.updateLeaderboard(user, false, false);
        }

        return submissionRepository.save(submission);
    }

    public List<Submission> getSubmissionsByProblemIdAndUsername(Long problemId, String username) {
        return submissionRepository.findByProblemIdAndUserUsername(problemId, username);
    }

    public Map<Long, String> getProblemStatusesForUser(String username) {
        Map<Long, String> statuses = new HashMap<>();

        for (Submission submission : submissionRepository.findByUserUsername(username)) {
            Long submittedProblemId = submission.getProblem().getId();
            String current = statuses.get(submittedProblemId);

            if (submission.getStatus() == SubmissionStatus.ACCEPTED) {
                statuses.put(submittedProblemId, "Solved");
            } else if (!"Solved".equals(current)) {
                statuses.put(submittedProblemId, "Attempted");
            }
        }

        return statuses;
    }

    public Map<String, Object> getUserSummary(String username) {
        List<Submission> submissions = submissionRepository.findByUserUsername(username);
        Set<Long> solvedProblemIds = new HashSet<>();
        long acceptedSubmissions = 0;
        Set<LocalDate> solvedDates = new HashSet<>();

        for (Submission submission : submissions) {
            if (submission.getStatus() == SubmissionStatus.ACCEPTED) {
                acceptedSubmissions++;
                solvedProblemIds.add(submission.getProblem().getId());
                if (submission.getSubmittedAt() != null) {
                    solvedDates.add(submission.getSubmittedAt().toLocalDate());
                }
            }
        }

        double accuracy = submissions.isEmpty() ? 0.0 : (acceptedSubmissions * 100.0) / submissions.size();

        Map<String, Object> summary = new HashMap<>();
        summary.put("problemsSolved", solvedProblemIds.size());
        summary.put("submissions", submissions.size());
        summary.put("accuracy", accuracy);
        summary.put("streak", calculateCurrentStreak(solvedDates));
        summary.put("recentSubmissions", submissions.stream()
                .sorted(Comparator.comparing(Submission::getSubmittedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .limit(5)
                .map(this::toRecentSubmission)
                .toList());
        return summary;
    }

    private Map<String, Object> toRecentSubmission(Submission submission) {
        Map<String, Object> recent = new HashMap<>();
        Map<String, Object> problemInfo = new HashMap<>();
        problemInfo.put("id", submission.getProblem().getId());
        problemInfo.put("title", submission.getProblem().getTitle());

        recent.put("id", submission.getId());
        recent.put("problem", problemInfo);
        recent.put("status", submission.getStatus());
        recent.put("language", submission.getLanguage());
        recent.put("submittedAt", submission.getSubmittedAt());
        return recent;
    }

    private int calculateCurrentStreak(Set<LocalDate> solvedDates) {
        if (solvedDates.isEmpty()) {
            return 0;
        }

        LocalDate cursor = LocalDate.now();
        if (!solvedDates.contains(cursor)) {
            cursor = cursor.minusDays(1);
        }

        int streak = 0;
        while (solvedDates.contains(cursor)) {
            streak++;
            cursor = cursor.minusDays(1);
        }
        return streak;
    }

    private SubmissionStatus convertStatus(String executionStatus) {

        if (executionStatus.equals("COMPILATION_ERROR")) {
            return SubmissionStatus.COMPILATION_ERROR;
        }

        if (executionStatus.equals("RUNTIME_ERROR")) {
            return SubmissionStatus.RUNTIME_ERROR;
        }

        if (executionStatus.equals("TIME_LIMIT_EXCEEDED")) {
            return SubmissionStatus.TIME_LIMIT_EXCEEDED;
        }

        return SubmissionStatus.RUNTIME_ERROR;
    }
}
