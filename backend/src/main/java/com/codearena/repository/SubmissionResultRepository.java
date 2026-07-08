package com.codearena.repository;

import com.codearena.entity.SubmissionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for {@link SubmissionResult} entities.
 * <p>
 * Provides retrieval of per-test-case results for a given submission.
 * </p>
 */
@Repository
public interface SubmissionResultRepository extends JpaRepository<SubmissionResult, Long> {

    /**
     * Retrieve all test-case results for the given submission.
     *
     * @param submissionId the parent submission's ID
     * @return list of results, one per test case
     */
    List<SubmissionResult> findBySubmissionId(Long submissionId);
}
