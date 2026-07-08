package com.codearena.repository;

import com.codearena.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for {@link TestCase} entities.
 * <p>
 * Provides look-ups by problem ID, with the ability to filter out
 * hidden test cases for the public-facing sample view.
 * </p>
 */
@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Long> {

    /**
     * Retrieve all test cases belonging to the given problem,
     * ordered by {@code orderIndex}.
     *
     * @param problemId the owning problem's ID
     * @return ordered list of test cases
     */
    List<TestCase> findByProblemIdOrderByOrderIndexAsc(Long problemId);

    /**
     * Retrieve only the visible (non-hidden) test cases for a problem.
     * Useful for displaying sample inputs/outputs to the user.
     *
     * @param problemId the owning problem's ID
     * @return list of visible test cases
     */
    List<TestCase> findByProblemIdAndIsHiddenFalse(Long problemId);

    /**
     * Retrieve all test cases for a problem (hidden and visible).
     *
     * @param problemId the owning problem's ID
     * @return list of test cases
     */
    List<TestCase> findByProblemId(Long problemId);
}
