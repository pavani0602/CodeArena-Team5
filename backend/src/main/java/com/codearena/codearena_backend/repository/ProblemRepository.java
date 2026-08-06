package com.codearena.codearena_backend.repository;

import com.codearena.codearena_backend.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

import com.codearena.codearena_backend.enumtype.DifficultyLevel;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
    long countByDifficulty(DifficultyLevel difficulty);
    java.util.Optional<Problem> findByTitleIgnoreCase(String title);
}