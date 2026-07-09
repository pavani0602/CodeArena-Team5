package com.codearena.codearena_backend.service;

import com.codearena.codearena_backend.dto.CodeExecutionRequest;
import com.codearena.codearena_backend.dto.CodeExecutionResponse;
import com.codearena.codearena_backend.dto.SubmissionRequest;
import com.codearena.codearena_backend.entity.Problem;
import com.codearena.codearena_backend.entity.Submission;
import com.codearena.codearena_backend.entity.SubmissionResult;
import com.codearena.codearena_backend.entity.TestCase;
import com.codearena.codearena_backend.entity.User;
import com.codearena.codearena_backend.enumtype.SubmissionStatus;
import com.codearena.codearena_backend.repository.ProblemRepository;
import com.codearena.codearena_backend.repository.SubmissionRepository;
import com.codearena.codearena_backend.repository.SubmissionResultRepository;
import com.codearena.codearena_backend.repository.TestCaseRepository;
import com.codearena.codearena_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubmissionService {

    private static final int MAX_SUBMISSIONS_PER_MINUTE = 5000;

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final TestCaseRepository testCaseRepository;
    private final CodeExecutionService codeExecutionService;
    private final SubmissionResultRepository submissionResultRepository;
    private final LeaderboardService leaderboardService;

    public SubmissionService(
            SubmissionRepository submissionRepository,
            ProblemRepository problemRepository,
            UserRepository userRepository,
            TestCaseRepository testCaseRepository,
            CodeExecutionService codeExecutionService,
            SubmissionResultRepository submissionResultRepository,
            LeaderboardService leaderboardService
    ) {
        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
        this.testCaseRepository = testCaseRepository;
        this.codeExecutionService = codeExecutionService;
        this.submissionResultRepository = submissionResultRepository;
        this.leaderboardService = leaderboardService;
    }

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

        for (TestCase testCase : testCases) {

            CodeExecutionRequest executionRequest = new CodeExecutionRequest();
            executionRequest.setLanguage(request.getLanguage());
            executionRequest.setCode(request.getCode());
            executionRequest.setInput(testCase.getInputData());

            CodeExecutionResponse executionResponse =
                    codeExecutionService.executeCode(executionRequest);

            String actualOutput = normalizeOutput(executionResponse.getOutput());
            String expectedOutput = normalizeOutput(testCase.getExpectedOutput());

            SubmissionResult result = new SubmissionResult();
            result.setSubmission(submission);
            result.setTestCase(testCase);
            result.setInputData(testCase.getInputData());
            result.setExpectedOutput(testCase.getExpectedOutput());
            result.setActualOutput(executionResponse.getOutput());
            result.setErrorMessage(executionResponse.getError());

            if (!executionResponse.getStatus().equals("SUCCESS")) {
                result.setStatus(executionResponse.getStatus());
                submissionResultRepository.save(result);

                submission.setStatus(convertStatus(executionResponse.getStatus()));
                return submissionRepository.save(submission);
            }

            if (actualOutput.equals(expectedOutput)) {
                result.setStatus("PASSED");
            } else {
                result.setStatus("FAILED");
                allPassed = false;
            }

            submissionResultRepository.save(result);

            if (!allPassed) {
                break;
            }
        }

        if (allPassed) {
            submission.setStatus(SubmissionStatus.ACCEPTED);
            leaderboardService.updateLeaderboard(user);
        } else {
            submission.setStatus(SubmissionStatus.WRONG_ANSWER);
        }

        return submissionRepository.save(submission);
    }

    public List<Submission> getSubmissionsByProblemId(Long problemId) {
        return submissionRepository.findByProblemId(problemId);
    }

    private String normalizeOutput(String output) {
        if (output == null) {
            return "";
        }

        return output.trim().replace("\r\n", "\n").replace("\r", "\n");
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