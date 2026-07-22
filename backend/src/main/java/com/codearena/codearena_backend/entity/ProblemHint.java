package com.codearena.codearena_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "problem_hints")
public class ProblemHint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Problem problem;

    @Column(name = "hint_number", nullable = false)
    private Integer hintNumber;

    @Column(name = "hint_text", nullable = false, columnDefinition = "TEXT")
    private String hintText;

    public ProblemHint() {
    }

    public Long getId() {
        return id;
    }

    public Problem getProblem() {
        return problem;
    }

    public void setProblem(Problem problem) {
        this.problem = problem;
    }

    public Integer getHintNumber() {
        return hintNumber;
    }

    public void setHintNumber(Integer hintNumber) {
        this.hintNumber = hintNumber;
    }

    public String getHintText() {
        return hintText;
    }

    public void setHintText(String hintText) {
        this.hintText = hintText;
    }
}
