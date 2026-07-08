package com.codearena.entity;

import com.codearena.enums.Difficulty;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA entity representing a coding problem on the CodeArena platform.
 * <p>
 * A problem contains a Markdown description, starter code templates for
 * multiple languages, optional hints (stored as a JSON array), and an
 * editorial solution that unlocks after a configurable number of failed
 * attempts.
 * </p>
 */
@Entity
@Table(name = "problems")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description_md", nullable = false, columnDefinition = "TEXT")
    private String descriptionMd;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", nullable = false, columnDefinition = "problem_difficulty")
    private Difficulty difficulty;

    @Column(name = "tags", length = 500)
    private String tags;

    @Column(name = "starter_code_java", columnDefinition = "TEXT")
    private String starterCodeJava;

    @Column(name = "starter_code_python", columnDefinition = "TEXT")
    private String starterCodePython;

    @Column(name = "starter_code_cpp", columnDefinition = "TEXT")
    private String starterCodeCpp;

    @Column(name = "starter_code_js", columnDefinition = "TEXT")
    private String starterCodeJs;

    /** JSON array of step-by-step hints. */
    @Column(name = "hints", columnDefinition = "TEXT")
    private String hints;

    /** Full editorial solution in Markdown. */
    @Column(name = "editorial_md", columnDefinition = "TEXT")
    private String editorialMd;

    /** Number of failed attempts before the editorial unlocks for a user. */
    @Column(name = "editorial_unlock_after", nullable = false)
    @Builder.Default
    private Integer editorialUnlockAfter = 3;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Relationships ───────────────────────────────────────────

    @JsonIgnore
    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<TestCase> testCases = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Submission> submissions = new ArrayList<>();
}
