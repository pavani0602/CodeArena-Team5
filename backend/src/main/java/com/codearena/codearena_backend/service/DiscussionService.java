package com.codearena.codearena_backend.service;

import com.codearena.codearena_backend.dto.DiscussionPostDto;
import com.codearena.codearena_backend.dto.DiscussionPostRequest;
import com.codearena.codearena_backend.entity.DiscussionLike;
import com.codearena.codearena_backend.entity.DiscussionPost;
import com.codearena.codearena_backend.entity.User;
import com.codearena.codearena_backend.repository.DiscussionLikeRepository;
import com.codearena.codearena_backend.repository.DiscussionPostRepository;
import com.codearena.codearena_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiscussionService {

    @Autowired
    private DiscussionPostRepository postRepository;

    @Autowired
    private DiscussionLikeRepository likeRepository;

    @Autowired
    private UserRepository userRepository;

    public List<DiscussionPostDto> getAllPosts(String currentUsername) {
        User currentUser = null;
        if (currentUsername != null) {
            currentUser = userRepository.findByUsername(currentUsername).orElse(null);
        }

        List<DiscussionPost> posts = postRepository.findAllByOrderByCreatedAtDesc();
        List<DiscussionPostDto> dtos = new ArrayList<>();

        for (DiscussionPost post : posts) {
            int likes = likeRepository.countByPost(post);
            boolean liked = false;
            if (currentUser != null) {
                liked = likeRepository.existsByPostAndUser(post, currentUser);
            }

            List<String> tags = new ArrayList<>();
            if (post.getTags() != null && !post.getTags().isEmpty()) {
                tags = Arrays.asList(post.getTags().split(","));
            }

            String authorName = post.getUser().getUsername();
            String avatar = authorName.substring(0, 1).toUpperCase();
            
            dtos.add(new DiscussionPostDto(
                    post.getId(),
                    authorName,
                    avatar,
                    formatTimeAgo(post.getCreatedAt()),
                    post.getTitle(),
                    post.getContent(),
                    tags,
                    likes,
                    0, // Comments not implemented yet
                    liked
            ));
        }

        return dtos;
    }

    @Transactional
    public DiscussionPostDto createPost(String currentUsername, DiscussionPostRequest request) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String tagsStr = "";
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            tagsStr = String.join(",", request.getTags());
        }

        DiscussionPost post = new DiscussionPost(user, request.getTitle(), request.getContent(), tagsStr);
        post = postRepository.save(post);

        return new DiscussionPostDto(
                post.getId(),
                user.getUsername(),
                user.getUsername().substring(0, 1).toUpperCase(),
                "Just now",
                post.getTitle(),
                post.getContent(),
                request.getTags() != null ? request.getTags() : new ArrayList<>(),
                0,
                0,
                false
        );
    }

    @Transactional
    public void toggleLike(String currentUsername, Long postId) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));
        DiscussionPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        likeRepository.findByPostAndUser(post, user).ifPresentOrElse(
                like -> likeRepository.delete(like),
                () -> likeRepository.save(new DiscussionLike(post, user))
        );
    }

    private String formatTimeAgo(LocalDateTime past) {
        LocalDateTime now = LocalDateTime.now();
        long minutes = ChronoUnit.MINUTES.between(past, now);
        
        if (minutes < 1) return "Just now";
        if (minutes < 60) return minutes + " mins ago";
        
        long hours = ChronoUnit.HOURS.between(past, now);
        if (hours < 24) return hours + " hours ago";
        
        long days = ChronoUnit.DAYS.between(past, now);
        return days + " days ago";
    }
}
