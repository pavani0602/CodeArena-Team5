package com.codearena.codearena_backend.entity;

import com.codearena.codearena_backend.enumtype.SubmissionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "problem_id", nullable = false)
    private Long problemId;

    @Column(nullable = false, length = 50)
    private String language;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = SubmissionStatus.PENDING;
        }
        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
    }
}