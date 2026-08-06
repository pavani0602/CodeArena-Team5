package com.codearena.codearena_backend.repository;

import com.codearena.codearena_backend.entity.SubmissionResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionResultRepository extends JpaRepository<SubmissionResult, Long> {

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM SubmissionResult sr WHERE sr.testCase.problem.id = :problemId")
    void deleteByProblemId(@org.springframework.data.repository.query.Param("problemId") Long problemId);

    List<SubmissionResult> findBySubmissionId(Long submissionId);
}