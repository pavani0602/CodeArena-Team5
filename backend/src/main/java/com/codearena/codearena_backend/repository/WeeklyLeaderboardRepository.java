package com.codearena.codearena_backend.repository;

import com.codearena.codearena_backend.entity.WeeklyLeaderboard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface WeeklyLeaderboardRepository extends JpaRepository<WeeklyLeaderboard, Long> {
    List<WeeklyLeaderboard> findByWeekStartDateOrderByScoreDesc(LocalDate weekStartDate);
    Optional<WeeklyLeaderboard> findByUserIdAndWeekStartDate(Long userId, LocalDate weekStartDate);
}
