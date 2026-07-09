package com.codearena.codearena_backend.repository;

import com.codearena.codearena_backend.entity.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeaderboardEntryRepository extends JpaRepository<LeaderboardEntry, Long> {

    Optional<LeaderboardEntry> findByUserId(Long userId);

    List<LeaderboardEntry> findAllByOrderByScoreDescSolvedCountDescLastAcceptedAtAsc();
}