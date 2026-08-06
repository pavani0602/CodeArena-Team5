package com.codearena.codearena_backend.controller;

import com.codearena.codearena_backend.dto.UserDto;
import com.codearena.codearena_backend.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class AdminController {

    private final UserRepository userRepository;
    private final com.codearena.codearena_backend.repository.SubmissionRepository submissionRepository;

    public AdminController(UserRepository userRepository, com.codearena.codearena_backend.repository.SubmissionRepository submissionRepository) {
        this.userRepository = userRepository;
        this.submissionRepository = submissionRepository;
    }

    @GetMapping("/api/admin/test")
    public String adminTest() {
        return "Admin API is working";
    }

    @GetMapping("/api/admin/users")
    public List<UserDto> getAllUsers() {
        // Add auth check here if desired. For now, rely on security filter if configured.
        return userRepository.findAll().stream()
                .map(user -> new UserDto(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @GetMapping("/api/admin/submissions")
    public List<com.codearena.codearena_backend.dto.AdminSubmissionDto> getAllSubmissions() {
        return submissionRepository.findAll().stream()
                .sorted((a, b) -> b.getSubmittedAt().compareTo(a.getSubmittedAt())) // Sort by latest
                .map(sub -> new com.codearena.codearena_backend.dto.AdminSubmissionDto(
                        sub.getId(),
                        sub.getUser().getUsername(),
                        sub.getUser().getEmail(),
                        sub.getProblem().getTitle(),
                        sub.getLanguage(),
                        sub.getStatus().name(),
                        sub.getSubmittedAt()
                ))
                .collect(Collectors.toList());
    }
}