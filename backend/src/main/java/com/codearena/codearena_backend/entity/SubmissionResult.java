package com.codearena.codearena_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "submission_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "submission_id", nullable = false)
    private Long submissionId;

    @Column(name = "test_case_id", nullable = false)
    private Long testCaseId;

    @Column(nullable = false)
    private Boolean passed;

    @Column(name = "exec_time_ms")
    private Long execTimeMs;

    @Column(name = "memory_kb")
    private Long memoryKb;

    @Column(name = "actual_output", columnDefinition = "TEXT")
    private String actualOutput;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
}