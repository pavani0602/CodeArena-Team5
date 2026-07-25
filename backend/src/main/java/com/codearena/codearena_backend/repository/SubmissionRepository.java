package com.codearena.codearena_backend.repository;

import com.codearena.codearena_backend.entity.Submission;
import com.codearena.codearena_backend.enumtype.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    List<Submission> findByProblemId(Long problemId);

    List<Submission> findByProblemIdAndUserUsername(Long problemId, String username);

    List<Submission> findByUserUsername(String username);

    boolean existsByUserIdAndProblemIdAndStatus(Long userId, Long problemId, SubmissionStatus status);

    long countByUserIdAndProblemIdAndSubmittedAtAfter(
            Long userId,
            Long problemId,
            LocalDateTime submittedAt
    );
}
