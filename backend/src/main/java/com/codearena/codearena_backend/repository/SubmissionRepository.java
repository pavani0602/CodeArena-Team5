package com.codearena.codearena_backend.repository;

import com.codearena.codearena_backend.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    List<Submission> findByProblemId(Long problemId);

    long countByUserIdAndProblemIdAndSubmittedAtAfter(
            Long userId,
            Long problemId,
            LocalDateTime submittedAt
    );
}