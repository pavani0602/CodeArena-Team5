package com.codearena.codearena_backend.dto;

import com.codearena.codearena_backend.enumtype.DifficultyLevel;
import java.util.List;

public class ProblemRequest {

    private String title;
    private String description;
    private DifficultyLevel difficulty;
    private String tags;
    private String editorialMd;
    private List<String> hints;

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

    public String getEditorialMd() {
        return editorialMd;
    }

    public void setEditorialMd(String editorialMd) {
        this.editorialMd = editorialMd;
    }

    public List<String> getHints() {
        return hints;
    }

    public void setHints(List<String> hints) {
        this.hints = hints;
    }
}