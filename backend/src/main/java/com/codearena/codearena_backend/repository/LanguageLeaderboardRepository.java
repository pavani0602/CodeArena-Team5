package com.codearena.codearena_backend.repository;

import com.codearena.codearena_backend.entity.LanguageLeaderboard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LanguageLeaderboardRepository extends JpaRepository<LanguageLeaderboard, Long> {
    List<LanguageLeaderboard> findByLanguageOrderByProblemsSolvedDesc(String language);
    Optional<LanguageLeaderboard> findByUserIdAndLanguage(Long userId, String language);
}
