package com.codearena.codearena_backend.dto;

import com.codearena.codearena_backend.enumtype.DifficultyLevel;

public class ProblemRequest {

    private String title;
    private String description;
    private DifficultyLevel difficulty;

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
}