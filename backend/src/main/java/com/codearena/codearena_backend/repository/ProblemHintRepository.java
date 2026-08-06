package com.codearena.codearena_backend.repository;

import com.codearena.codearena_backend.entity.ProblemHint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProblemHintRepository extends JpaRepository<ProblemHint, Long> {
    List<ProblemHint> findByProblemIdOrderByHintNumberAsc(Long problemId);
    long countByProblemId(Long problemId);
    
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM ProblemHint ph WHERE ph.problem.id = :problemId")
    void deleteByProblemId(@org.springframework.data.repository.query.Param("problemId") Long problemId);
}
