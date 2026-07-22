package com.codearena.codearena_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "problem_starter_codes")
public class ProblemStarterCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Problem problem;

    @Column(nullable = false, length = 50)
    private String language;

    @Column(name = "code_template", nullable = false, columnDefinition = "TEXT")
    private String codeTemplate;

    public ProblemStarterCode() {
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

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCodeTemplate() {
        return codeTemplate;
    }

    public void setCodeTemplate(String codeTemplate) {
        this.codeTemplate = codeTemplate;
    }
}
