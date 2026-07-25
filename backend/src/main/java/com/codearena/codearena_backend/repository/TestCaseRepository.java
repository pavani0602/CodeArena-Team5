package com.codearena.codearena_backend.repository;

import com.codearena.codearena_backend.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {

    List<TestCase> findByProblemId(Long problemId);
    
    @org.springframework.transaction.annotation.Transactional
    void deleteByProblemId(Long problemId);
}