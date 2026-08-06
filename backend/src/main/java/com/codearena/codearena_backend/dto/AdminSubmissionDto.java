package com.codearena.codearena_backend.dto;

import java.time.LocalDateTime;

public class AdminSubmissionDto {
    private Long submissionId;
    private String username;
    private String email;
    private String problemTitle;
    private String language;
    private String status;
    private LocalDateTime submittedAt;

    public AdminSubmissionDto(Long submissionId, String username, String email, String problemTitle, String language, String status, LocalDateTime submittedAt) {
        this.submissionId = submissionId;
        this.username = username;
        this.email = email;
        this.problemTitle = problemTitle;
        this.language = language;
        this.status = status;
        this.submittedAt = submittedAt;
    }

    public Long getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProblemTitle() {
        return problemTitle;
    }

    public void setProblemTitle(String problemTitle) {
        this.problemTitle = problemTitle;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}
