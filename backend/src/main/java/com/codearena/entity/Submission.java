package com.codearena.entity;

import com.codearena.enums.SubmissionStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA entity representing a user's code submission for a specific problem.
 * <p>
 * Each submission records the chosen language, full source code, current
 * evaluation status, and aggregate performance metrics once judging is
 * complete.
 * </p>
 */
@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Problem problem;

    @Column(name = "language", nullable = false, length = 20)
    private String language;

    @Column(name = "source_code", nullable = false, columnDefinition = "TEXT")
    private String sourceCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "submission_status")
    @Builder.Default
    private SubmissionStatus status = SubmissionStatus.PENDING;

    @CreationTimestamp
    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    /** Total execution time across all test cases in milliseconds. */
    @Column(name = "total_exec_time_ms")
    private Long totalExecTimeMs;

    /** Total memory consumed across all test cases in kilobytes. */
    @Column(name = "total_memory_kb")
    private Long totalMemoryKb;

    // ── Relationships ───────────────────────────────────────────

    @JsonIgnore
    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<SubmissionResult> results = new ArrayList<>();
}
