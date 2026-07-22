package com.codearena.codearena_backend.service;

import com.codearena.codearena_backend.entity.LeaderboardEntry;
import com.codearena.codearena_backend.entity.Submission;
import com.codearena.codearena_backend.entity.User;
import com.codearena.codearena_backend.enumtype.SubmissionStatus;
import com.codearena.codearena_backend.repository.LeaderboardEntryRepository;
import com.codearena.codearena_backend.repository.SubmissionRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class LeaderboardService {

    private final LeaderboardEntryRepository leaderboardEntryRepository;
    private final SubmissionRepository submissionRepository;

    public LeaderboardService(LeaderboardEntryRepository leaderboardEntryRepository, SubmissionRepository submissionRepository) {
        this.leaderboardEntryRepository = leaderboardEntryRepository;
        this.submissionRepository = submissionRepository;
    }

    public void updateLeaderboard(User user) {

        LeaderboardEntry entry = leaderboardEntryRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    LeaderboardEntry newEntry = new LeaderboardEntry();
                    newEntry.setUser(user);
                    newEntry.setProblemsSolved(0);
                    newEntry.setAccuracy(0.0);
                    return newEntry;
                });

        entry.setProblemsSolved(entry.getProblemsSolved() + 1);

        leaderboardEntryRepository.save(entry);
    }

    public List<LeaderboardEntry> getLeaderboard() {
        Map<Long, UserStats> statsByUser = new HashMap<>();

        for (Submission submission : submissionRepository.findAll()) {
            User user = submission.getUser();
            UserStats stats = statsByUser.computeIfAbsent(user.getId(), ignored -> new UserStats(user));
            stats.totalSubmissions++;

            if (submission.getStatus() == SubmissionStatus.ACCEPTED) {
                stats.acceptedSubmissions++;
                stats.solvedProblemIds.add(submission.getProblem().getId());
            }
        }

        List<LeaderboardEntry> entries = new ArrayList<>();
        for (UserStats stats : statsByUser.values()) {
            LeaderboardEntry entry = new LeaderboardEntry();
            entry.setUser(stats.user);
            entry.setProblemsSolved(stats.solvedProblemIds.size());
            entry.setAccuracy(stats.totalSubmissions == 0
                    ? 0.0
                    : (stats.acceptedSubmissions * 100.0) / stats.totalSubmissions);
            entries.add(entry);
        }

        entries.sort((left, right) -> {
            int bySolved = Integer.compare(right.getProblemsSolved(), left.getProblemsSolved());
            if (bySolved != 0) return bySolved;
            return Double.compare(right.getAccuracy(), left.getAccuracy());
        });

        for (int index = 0; index < entries.size(); index++) {
            entries.get(index).setRank(index + 1);
        }

        return entries;
    }

    public List<Map<String, Object>> getWeeklyLeaderboard() {
        // Calculate current week start (Monday)
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalDate weekStart = today.with(java.time.DayOfWeek.MONDAY);

        Map<Long, WeeklyUserStats> statsByUser = new HashMap<>();

        for (Submission submission : submissionRepository.findAll()) {
            if (submission.getSubmittedAt() == null) continue;
            java.time.LocalDate subDate = submission.getSubmittedAt().toLocalDate();
            if (subDate.isBefore(weekStart) || subDate.isAfter(today)) continue;

            User user = submission.getUser();
            WeeklyUserStats stats = statsByUser.computeIfAbsent(user.getId(), ignored -> new WeeklyUserStats(user));
            stats.totalSubmissions++;
            if (submission.getStatus() == SubmissionStatus.ACCEPTED) {
                stats.acceptedSubmissions++;
                stats.solvedProblemIds.add(submission.getProblem().getId());
            }
        }

        List<Map<String, Object>> results = new java.util.ArrayList<>();
        for (WeeklyUserStats stats : statsByUser.values()) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("username", stats.user.getUsername());
            entry.put("userId", stats.user.getId());
            entry.put("problemsSolved", stats.solvedProblemIds.size());
            entry.put("accuracy", stats.totalSubmissions == 0 ? 0.0 : (stats.acceptedSubmissions * 100.0) / stats.totalSubmissions);
            results.add(entry);
        }

        results.sort((a, b) -> {
            int bySolved = Integer.compare((int) b.get("problemsSolved"), (int) a.get("problemsSolved"));
            if (bySolved != 0) return bySolved;
            return Double.compare((double) b.get("accuracy"), (double) a.get("accuracy"));
        });

        for (int i = 0; i < results.size(); i++) {
            results.get(i).put("rank", i + 1);
        }

        return results;
    }

    public List<Map<String, Object>> getLanguageLeaderboard(String language) {
        Map<Long, WeeklyUserStats> statsByUser = new HashMap<>();

        for (Submission submission : submissionRepository.findAll()) {
            if (!language.equalsIgnoreCase(submission.getLanguage())) continue;

            User user = submission.getUser();
            WeeklyUserStats stats = statsByUser.computeIfAbsent(user.getId(), ignored -> new WeeklyUserStats(user));
            stats.totalSubmissions++;
            if (submission.getStatus() == SubmissionStatus.ACCEPTED) {
                stats.acceptedSubmissions++;
                stats.solvedProblemIds.add(submission.getProblem().getId());
            }
        }

        List<Map<String, Object>> results = new java.util.ArrayList<>();
        for (WeeklyUserStats stats : statsByUser.values()) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("username", stats.user.getUsername());
            entry.put("userId", stats.user.getId());
            entry.put("problemsSolved", stats.solvedProblemIds.size());
            entry.put("accuracy", stats.totalSubmissions == 0 ? 0.0 : (stats.acceptedSubmissions * 100.0) / stats.totalSubmissions);
            results.add(entry);
        }

        results.sort((a, b) -> {
            int bySolved = Integer.compare((int) b.get("problemsSolved"), (int) a.get("problemsSolved"));
            if (bySolved != 0) return bySolved;
            return Double.compare((double) b.get("accuracy"), (double) a.get("accuracy"));
        });

        for (int i = 0; i < results.size(); i++) {
            results.get(i).put("rank", i + 1);
        }

        return results;
    }

    private static class WeeklyUserStats {
        private final User user;
        private final Set<Long> solvedProblemIds = new HashSet<>();
        private int totalSubmissions;
        private int acceptedSubmissions;

        private WeeklyUserStats(User user) {
            this.user = user;
        }
    }

    private static class UserStats {
        private final User user;
        private final Set<Long> solvedProblemIds = new HashSet<>();
        private int totalSubmissions;
        private int acceptedSubmissions;

        private UserStats(User user) {
            this.user = user;
        }
    }
}
