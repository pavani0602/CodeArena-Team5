package com.codearena.codearena_backend.controller;

import com.codearena.codearena_backend.entity.SubmissionResult;
import com.codearena.codearena_backend.repository.SubmissionResultRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submission-results")
public class SubmissionResultController {

    private final SubmissionResultRepository submissionResultRepository;

    public SubmissionResultController(SubmissionResultRepository submissionResultRepository) {
        this.submissionResultRepository = submissionResultRepository;
    }

    @GetMapping("/submission/{submissionId}")
    public List<SubmissionResult> getResultsBySubmission(@PathVariable Long submissionId) {
        return submissionResultRepository.findBySubmissionId(submissionId);
    }
}