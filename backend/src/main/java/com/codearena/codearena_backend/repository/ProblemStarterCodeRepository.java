package com.codearena.codearena_backend.repository;

import com.codearena.codearena_backend.entity.ProblemStarterCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProblemStarterCodeRepository extends JpaRepository<ProblemStarterCode, Long> {
    List<ProblemStarterCode> findByProblemId(Long problemId);
    Optional<ProblemStarterCode> findByProblemIdAndLanguage(Long problemId, String language);
}
