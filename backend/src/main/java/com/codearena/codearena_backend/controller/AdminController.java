package com.codearena.codearena_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController {

    private final com.codearena.codearena_backend.repository.UserRepository userRepository;
    private final com.codearena.codearena_backend.repository.SubmissionRepository submissionRepository;
    private final com.codearena.codearena_backend.repository.SubmissionResultRepository submissionResultRepository;

    public AdminController(com.codearena.codearena_backend.repository.UserRepository userRepository,
                           com.codearena.codearena_backend.repository.SubmissionRepository submissionRepository,
                           com.codearena.codearena_backend.repository.SubmissionResultRepository submissionResultRepository) {
        this.userRepository = userRepository;
        this.submissionRepository = submissionRepository;
        this.submissionResultRepository = submissionResultRepository;
    }

    @GetMapping("/api/admin/test")
    public String adminTest() {
        return "Admin API is working";
    }

    @GetMapping("/api/admin/users")
    public java.util.List<java.util.Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream().map(u -> java.util.Map.of(
            "id", (Object) u.getId(),
            "username", (Object) u.getUsername(),
            "email", (Object) u.getEmail(),
            "role", (Object) u.getRole()
        )).toList();
    }

    @GetMapping("/api/admin/submissions")
    public java.util.List<java.util.Map<String, Object>> getAllSubmissions() {
        return submissionResultRepository.findAll().stream().map(sr -> java.util.Map.of(
            "id", (Object) sr.getId(),
            "submission_id", (Object) sr.getSubmission().getId(),
            "status", (Object) sr.getStatus(),
            "error", (Object) (sr.getErrorMessage() != null ? sr.getErrorMessage() : "")
        )).toList();
    }
}