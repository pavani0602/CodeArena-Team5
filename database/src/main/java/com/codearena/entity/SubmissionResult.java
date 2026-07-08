package com.codearena.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

/**
 * JPA entity representing the result of evaluating a single
 * {@link TestCase} against a {@link Submission}.
 * <p>
 * Stores whether the test case passed, the actual output produced,
 * execution time, memory usage, and any error messages.
 * </p>
 */
@Entity
@Table(name = "submission_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Submission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_case_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private TestCase testCase;

    @Column(name = "passed", nullable = false)
    private Boolean passed;

    @Column(name = "actual_output", columnDefinition = "TEXT")
    private String actualOutput;

    /** Execution time for this test case in milliseconds. */
    @Column(name = "exec_time_ms")
    private Long execTimeMs;

    /** Memory consumed for this test case in kilobytes. */
    @Column(name = "memory_kb")
    private Long memoryKb;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
}
