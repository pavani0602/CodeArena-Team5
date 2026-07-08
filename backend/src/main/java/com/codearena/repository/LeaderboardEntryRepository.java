package com.codearena.repository;

import com.codearena.entity.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link LeaderboardEntry} entities.
 * <p>
 * Supports user-specific look-ups, full global leaderboard retrieval
 * (sorted by score then accuracy), and a top-10 shortcut for dashboard
 * widgets.
 * </p>
 */
@Repository
public interface LeaderboardEntryRepository extends JpaRepository<LeaderboardEntry, Long> {

    /**
     * Find the leaderboard entry for a specific user.
     *
     * @param userId the user's ID
     * @return an {@link Optional} containing the entry if it exists
     */
    Optional<LeaderboardEntry> findByUserId(Long userId);

    /**
     * Retrieve the global leaderboard sorted by total score (descending),
     * then by accuracy (descending) as a tiebreaker.
     *
     * @return sorted list of all leaderboard entries
     */
    List<LeaderboardEntry> findAllByOrderByTotalScoreDescAccuracyDesc();

    /**
     * Retrieve the top 10 users by total score — ideal for dashboard
     * widgets and summary views.
     *
     * @return top 10 leaderboard entries
     */
    List<LeaderboardEntry> findTop10ByOrderByTotalScoreDesc();
}
