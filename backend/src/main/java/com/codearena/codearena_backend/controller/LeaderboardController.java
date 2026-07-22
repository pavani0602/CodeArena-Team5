package com.codearena.codearena_backend.controller;

import com.codearena.codearena_backend.entity.LeaderboardEntry;
import com.codearena.codearena_backend.service.LeaderboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public List<LeaderboardEntry> getLeaderboard() {
        return leaderboardService.getLeaderboard();
    }

    @GetMapping("/weekly")
    public List<Map<String, Object>> getWeeklyLeaderboard() {
        return leaderboardService.getWeeklyLeaderboard();
    }

    @GetMapping("/language/{language}")
    public List<Map<String, Object>> getLanguageLeaderboard(@PathVariable String language) {
        return leaderboardService.getLanguageLeaderboard(language);
    }
}