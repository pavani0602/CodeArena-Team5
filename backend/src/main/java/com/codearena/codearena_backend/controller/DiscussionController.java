package com.codearena.codearena_backend.controller;

import com.codearena.codearena_backend.dto.DiscussionPostDto;
import com.codearena.codearena_backend.dto.DiscussionPostRequest;
import com.codearena.codearena_backend.service.DiscussionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.codearena.codearena_backend.entity.User;

@RestController
@RequestMapping("/api/discussions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DiscussionController {

    @Autowired
    private DiscussionService discussionService;

    @GetMapping
    public ResponseEntity<List<DiscussionPostDto>> getAllPosts() {
        String username = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !authentication.getPrincipal().equals("anonymousUser")) {
            username = currentUsername();
        }
        
        return ResponseEntity.ok(discussionService.getAllPosts(username));
    }

    @PostMapping
    public ResponseEntity<DiscussionPostDto> createPost(@RequestBody DiscussionPostRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        
        DiscussionPostDto newPost = discussionService.createPost(currentUsername(), request);
        return ResponseEntity.ok(newPost);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        
        discussionService.toggleLike(currentUsername(), id);
        return ResponseEntity.ok().build();
    }

    private String currentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof User user) {
            return user.getUsername();
        }

        return auth.getName();
    }
}
