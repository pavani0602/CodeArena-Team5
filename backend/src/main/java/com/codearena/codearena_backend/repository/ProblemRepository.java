package com.codearena.codearena_backend.repository;

import com.codearena.codearena_backend.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
}