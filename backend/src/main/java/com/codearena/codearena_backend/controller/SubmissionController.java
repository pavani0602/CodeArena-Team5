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
    public String createSubmission(
            @PathVariable Long problemId,
            @RequestBody SubmissionRequest request
    ) {
        try {
            Submission submission = submissionService.createSubmission(problemId, "testuser6", request);
            return "Submission saved successfully. Status: " + submission.getStatus();
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