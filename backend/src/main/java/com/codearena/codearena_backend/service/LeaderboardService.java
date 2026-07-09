package com.codearena.codearena_backend.service;

import com.codearena.codearena_backend.entity.LeaderboardEntry;
import com.codearena.codearena_backend.entity.User;
import com.codearena.codearena_backend.repository.LeaderboardEntryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaderboardService {

    private final LeaderboardEntryRepository leaderboardEntryRepository;

    public LeaderboardService(LeaderboardEntryRepository leaderboardEntryRepository) {
        this.leaderboardEntryRepository = leaderboardEntryRepository;
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
        return leaderboardEntryRepository.findAllByOrderByProblemsSolvedDesc();
    }
}