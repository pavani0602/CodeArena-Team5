package com.codearena.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * JPA entity representing a user's aggregated statistics on the
 * global leaderboard.
 * <p>
 * Scores are weighted by difficulty: EASY = 1, MEDIUM = 3, HARD = 5.
 * Accuracy is the acceptance rate expressed as a percentage (0–100).
 * </p>
 */
@Entity
@Table(name = "leaderboard_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @Column(name = "problems_solved", nullable = false)
    @Builder.Default
    private Integer problemsSolved = 0;

    @Column(name = "easy_solved", nullable = false)
    @Builder.Default
    private Integer easySolved = 0;

    @Column(name = "medium_solved", nullable = false)
    @Builder.Default
    private Integer mediumSolved = 0;

    @Column(name = "hard_solved", nullable = false)
    @Builder.Default
    private Integer hardSolved = 0;

    @Column(name = "total_submissions", nullable = false)
    @Builder.Default
    private Integer totalSubmissions = 0;

    /** Acceptance rate as a percentage (0.0 – 100.0). */
    @Column(name = "accuracy", nullable = false)
    @Builder.Default
    private Double accuracy = 0.0;

    /** Weighted score: easy×1 + medium×3 + hard×5. */
    @Column(name = "total_score", nullable = false)
    @Builder.Default
    private Integer totalScore = 0;

    @Column(name = "fastest_avg_time_ms")
    private Long fastestAvgTimeMs;

    @Column(name = "rank")
    private Integer rank;

    @UpdateTimestamp
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
}
