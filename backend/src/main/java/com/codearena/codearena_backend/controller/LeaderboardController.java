package com.codearena.codearena_backend.controller;

import com.codearena.codearena_backend.entity.LeaderboardEntry;
import com.codearena.codearena_backend.service.LeaderboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}