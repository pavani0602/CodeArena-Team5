package com.codearena.codearena_backend.dto;

public class AnalyticsResponse {
    private long totalUsers;
    private long totalProblems;
    private long totalSubmissions;
    private long uptimeSeconds;
    private String status;

    public AnalyticsResponse() {
    }

    public AnalyticsResponse(long totalUsers, long totalProblems, long totalSubmissions, long uptimeSeconds, String status) {
        this.totalUsers = totalUsers;
        this.totalProblems = totalProblems;
        this.totalSubmissions = totalSubmissions;
        this.uptimeSeconds = uptimeSeconds;
        this.status = status;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalProblems() {
        return totalProblems;
    }

    public void setTotalProblems(long totalProblems) {
        this.totalProblems = totalProblems;
    }

    public long getTotalSubmissions() {
        return totalSubmissions;
    }

    public void setTotalSubmissions(long totalSubmissions) {
        this.totalSubmissions = totalSubmissions;
    }

    public long getUptimeSeconds() {
        return uptimeSeconds;
    }

    public void setUptimeSeconds(long uptimeSeconds) {
        this.uptimeSeconds = uptimeSeconds;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
