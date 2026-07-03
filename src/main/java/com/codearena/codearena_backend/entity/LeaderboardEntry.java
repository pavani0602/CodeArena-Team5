package com.codearena.codearena_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "leaderboard_entries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "problems_solved")
    private Integer problemsSolved;

    @Column(precision = 5, scale = 2)
    private BigDecimal accuracy;

    @Column(name = "rank")
    private Integer rank;

    @PrePersist
    public void prePersist() {
        if (problemsSolved == null) {
            problemsSolved = 0;
        }
        if (accuracy == null) {
            accuracy = BigDecimal.ZERO;
        }
    }
}