package com.codearena.codearena_backend.controller;

import com.codearena.codearena_backend.dto.SubmissionRequest;
import com.codearena.codearena_backend.entity.Submission;
import com.codearena.codearena_backend.service.SubmissionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

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
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            String username = (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) ? auth.getName() : "testuser6";
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
}