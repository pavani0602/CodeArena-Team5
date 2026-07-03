package com.codearena.codearena_backend.repository;

import com.codearena.codearena_backend.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    long countByUserIdAndProblemIdAndSubmittedAtAfter(
            Long userId,
            Long problemId,
            LocalDateTime submittedAt
    );
}