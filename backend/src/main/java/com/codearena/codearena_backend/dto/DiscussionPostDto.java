package com.codearena.codearena_backend.dto;

import java.util.List;

public class DiscussionPostDto {
    private Long id;
    private String author;
    private String avatar;
    private String time;
    private String title;
    private String content;
    private List<String> tags;
    private int likes;
    private int comments;
    private boolean liked;

    public DiscussionPostDto() {}

    public DiscussionPostDto(Long id, String author, String avatar, String time, String title, String content, List<String> tags, int likes, int comments, boolean liked) {
        this.id = id;
        this.author = author;
        this.avatar = avatar;
        this.time = time;
        this.title = title;
        this.content = content;
        this.tags = tags;
        this.likes = likes;
        this.comments = comments;
        this.liked = liked;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }

    public int getComments() { return comments; }
    public void setComments(int comments) { this.comments = comments; }

    public boolean isLiked() { return liked; }
    public void setLiked(boolean liked) { this.liked = liked; }
}
