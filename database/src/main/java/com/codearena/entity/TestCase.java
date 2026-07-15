package com.codearena.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

/**
 * JPA entity representing a single test case associated with a {@link Problem}.
 * <p>
 * Test cases can be visible (shown to the user as examples) or hidden
 * (used only for server-side evaluation). An optional per-case time limit
 * override allows fine-grained performance constraints.
 * </p>
 */
@Entity
@Table(name = "test_cases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Problem problem;

    @Column(name = "input", nullable = false, columnDefinition = "TEXT")
    private String input;

    @Column(name = "expected_output", nullable = false, columnDefinition = "TEXT")
    private String expectedOutput;

    @Column(name = "is_hidden", nullable = false)
    @Builder.Default
    private Boolean isHidden = false;

    /** Optional per-case time limit in milliseconds. */
    @Column(name = "time_limit_override")
    private Integer timeLimitOverride;

    /** Display ordering within the problem's test-case list. */
    @Column(name = "order_index")
    private Integer orderIndex;
}
