package com.codearena.codearena_backend.controller;

import com.codearena.codearena_backend.dto.ProblemRequest;
import com.codearena.codearena_backend.entity.Problem;
import com.codearena.codearena_backend.service.ProblemService;
import com.codearena.codearena_backend.judge.ProblemMetadataService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;
    private final ProblemMetadataService problemMetadataService;

    public ProblemController(ProblemService problemService, ProblemMetadataService problemMetadataService) {
        this.problemService = problemService;
        this.problemMetadataService = problemMetadataService;
    }

    @PostMapping
    public Problem createProblem(@RequestBody ProblemRequest request) {
        return problemService.createProblem(request);
    }

    @GetMapping("/metadata/{title}")
    public ResponseEntity<?> getMetadata(@PathVariable String title) {
        return problemMetadataService.findByTitle(title)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Problem> getAllProblems() {
        return problemService.getAllProblems();
    }

    @GetMapping("/{id}")
    public Problem getProblemById(@PathVariable Long id) {
        return problemService.getProblemById(id);
    }

    @PutMapping("/{id}")
    public Problem updateProblem(@PathVariable Long id, @RequestBody ProblemRequest request) {
        return problemService.updateProblem(id, request);
    }
}