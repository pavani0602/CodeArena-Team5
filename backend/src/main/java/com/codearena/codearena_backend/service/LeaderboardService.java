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

    public void updateLeaderboard(User user, boolean isAccepted, boolean isFirstTimeSolved) {
        LeaderboardEntry entry = leaderboardEntryRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    LeaderboardEntry newEntry = new LeaderboardEntry();
                    newEntry.setUser(user);
                    newEntry.setProblemsSolved(0);
                    newEntry.setTotalSubmissions(0);
                    newEntry.setAcceptedSubmissions(0);
                    newEntry.setAccuracy(0.0);
                    return newEntry;
                });

        entry.setTotalSubmissions(entry.getTotalSubmissions() + 1);

        if (isAccepted) {
            entry.setAcceptedSubmissions(entry.getAcceptedSubmissions() + 1);
        }

        if (isFirstTimeSolved) {
            entry.setProblemsSolved(entry.getProblemsSolved() + 1);
        }

        entry.setAccuracy(entry.getTotalSubmissions() == 0 
            ? 0.0 
            : (entry.getAcceptedSubmissions() * 100.0) / entry.getTotalSubmissions());

        leaderboardEntryRepository.save(entry);
    }

    public List<LeaderboardEntry> getLeaderboard() {
        List<LeaderboardEntry> entries = leaderboardEntryRepository.findAll();

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
}
