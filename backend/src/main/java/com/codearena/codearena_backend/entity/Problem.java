package com.codearena.codearena_backend.entity;

import com.codearena.codearena_backend.enumtype.DifficultyLevel;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "problems")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "description_md", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DifficultyLevel difficulty;

    @Column(length = 500)
    private String tags;

    @Column(name = "editorial_md", columnDefinition = "TEXT")
    private String editorialMd;

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProblemHint> hints = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Problem() {
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public DifficultyLevel getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(DifficultyLevel difficulty) {
        this.difficulty = difficulty;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getEditorialMd() {
        return editorialMd;
    }

    public void setEditorialMd(String editorialMd) {
        this.editorialMd = editorialMd;
    }

    public List<ProblemHint> getHints() {
        return hints;
    }

    public void setHints(List<ProblemHint> hints) {
        this.hints.clear();
        if (hints != null) {
            this.hints.addAll(hints);
        }
    }
}