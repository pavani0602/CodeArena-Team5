package com.codearena.repository;

import com.codearena.entity.Problem;
import com.codearena.enums.Difficulty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for {@link Problem} entities.
 * <p>
 * Supports filtering by difficulty, tag substring matching, and
 * case-insensitive title search.
 * </p>
 */
@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    /**
     * Retrieve all problems with the specified difficulty level.
     *
     * @param difficulty the difficulty filter
     * @return list of matching problems
     */
    List<Problem> findByDifficulty(Difficulty difficulty);

    /**
     * Find problems whose comma-separated {@code tags} column contains
     * the given substring (case-sensitive).
     *
     * @param tag the tag substring to search for (e.g. "DP")
     * @return list of matching problems
     */
    List<Problem> findByTagsContaining(String tag);

    /**
     * Case-insensitive search for problems whose title contains the
     * given keyword.
     *
     * @param keyword the search keyword
     * @return list of matching problems
     */
    @Query("SELECT p FROM Problem p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Problem> searchByTitle(@Param("keyword") String keyword);
}
