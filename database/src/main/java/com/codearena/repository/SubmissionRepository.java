package com.codearena.repository;

import com.codearena.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Spring Data JPA repository for {@link Submission} entities.
 * <p>
 * Supports user-centric and problem-centric queries, as well as a
 * time-windowed count method useful for rate-limiting submissions.
 * </p>
 */
@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    /**
     * Retrieve all submissions made by a specific user, ordered by
     * submission time (most recent first).
     *
     * @param userId the submitting user's ID
     * @return list of submissions
     */
    List<Submission> findByUserIdOrderBySubmittedAtDesc(Long userId);

    /**
     * Retrieve all submissions by a specific user for a specific problem,
     * ordered by submission time (most recent first).
     *
     * @param userId    the submitting user's ID
     * @param problemId the target problem's ID
     * @return list of submissions
     */
    List<Submission> findByUserIdAndProblemIdOrderBySubmittedAtDesc(Long userId, Long problemId);

    /**
     * Count how many submissions a user has made for a given problem
     * since the specified timestamp. Useful for rate-limiting.
     *
     * @param userId    the submitting user's ID
     * @param problemId the target problem's ID
     * @param since     the start of the time window
     * @return number of submissions in the window
     */
    long countByUserIdAndProblemIdAndSubmittedAtAfter(Long userId, Long problemId, LocalDateTime since);

    /**
     * Retrieve all submissions for a specific problem, ordered by
     * submission time (most recent first).
     *
     * @param problemId the target problem's ID
     * @return list of submissions
     */
    List<Submission> findByProblemIdOrderBySubmittedAtDesc(Long problemId);

    /**
     * Retrieve all submissions made by a specific user.
     *
     * @param userId the submitting user's ID
     * @return list of submissions
     */
    List<Submission> findByUserId(Long userId);

    /**
     * Retrieve all submissions for a specific problem.
     *
     * @param problemId the target problem's ID
     * @return list of submissions
     */
    List<Submission> findByProblemId(Long problemId);
}
