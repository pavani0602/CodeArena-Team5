package com.codearena.codearena_backend.service;

import com.codearena.codearena_backend.entity.LeaderboardEntry;
import com.codearena.codearena_backend.entity.User;
import com.codearena.codearena_backend.repository.LeaderboardEntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LeaderboardService {

    private static final int POINTS_PER_ACCEPTED_SUBMISSION = 100;

    private final LeaderboardEntryRepository leaderboardEntryRepository;

    public LeaderboardService(LeaderboardEntryRepository leaderboardEntryRepository) {
        this.leaderboardEntryRepository = leaderboardEntryRepository;
    }

    public void updateLeaderboard(User user) {

        LeaderboardEntry entry = leaderboardEntryRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    LeaderboardEntry newEntry = new LeaderboardEntry();
                    newEntry.setUser(user);
                    newEntry.setScore(0);
                    newEntry.setSolvedCount(0);
                    return newEntry;
                });

        entry.setScore(entry.getScore() + POINTS_PER_ACCEPTED_SUBMISSION);
        entry.setSolvedCount(entry.getSolvedCount() + 1);
        entry.setLastAcceptedAt(LocalDateTime.now());

        leaderboardEntryRepository.save(entry);
    }

    public List<LeaderboardEntry> getLeaderboard() {
        return leaderboardEntryRepository.findAllByOrderByScoreDescSolvedCountDescLastAcceptedAtAsc();
    }
}