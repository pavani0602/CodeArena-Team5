package com.codearena.codearena_backend.controller;

import com.codearena.codearena_backend.dto.SubmissionRequest;
import com.codearena.codearena_backend.entity.Submission;
import com.codearena.codearena_backend.entity.User;
import com.codearena.codearena_backend.service.SubmissionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping("/problem/{problemId}")
    public Submission createSubmission(
            @PathVariable Long problemId,
            @RequestBody SubmissionRequest request
    ) {
        try {
            String username = currentUsername();
            return submissionService.createSubmission(problemId, username, request);
        } catch (RuntimeException e) {

            if (e.getMessage() != null && e.getMessage().contains("Submission limit exceeded")) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, e.getMessage());
            }

            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @GetMapping("/problem/{problemId}")
    public List<Submission> getSubmissionsByProblem(@PathVariable Long problemId) {
        return submissionService.getSubmissionsByProblemId(problemId);
    }

    @GetMapping("/statuses")
    public Map<Long, String> getProblemStatuses() {
        return submissionService.getProblemStatusesForUser(currentUsername());
    }

    @GetMapping("/summary")
    public Map<String, Object> getUserSummary() {
        return submissionService.getUserSummary(currentUsername());
    }

    private String currentUsername() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return "testuser6";
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof User user) {
            return user.getUsername();
        }

        return auth.getName();
    }
}
