package com.codearena.codearena_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "language_leaderboards")
public class LanguageLeaderboard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(nullable = false, length = 50)
    private String language;

    @Column(name = "problems_solved", nullable = false)
    private Integer problemsSolved = 0;

    @Column(name = "accuracy")
    private Double accuracy = 0.0;

    @Column(name = "rank")
    private Integer rank;

    public LanguageLeaderboard() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Integer getProblemsSolved() {
        return problemsSolved;
    }

    public void setProblemsSolved(Integer problemsSolved) {
        this.problemsSolved = problemsSolved;
    }

    public Double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(Double accuracy) {
        this.accuracy = accuracy;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }
}
