package com.codearena.codearena_backend.controller;

import com.codearena.codearena_backend.dto.ProblemRequest;
import com.codearena.codearena_backend.entity.Problem;
import com.codearena.codearena_backend.service.ProblemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @PostMapping
    public Problem createProblem(@RequestBody ProblemRequest request) {
        return problemService.createProblem(request);
    }

    @GetMapping
    public List<Problem> getAllProblems() {
        return problemService.getAllProblems();
    }

    @GetMapping("/{id}")
    public Problem getProblemById(@PathVariable Long id) {
        return problemService.getProblemById(id);
    }
    @GetMapping("/{id}/hints")
    public java.util.List<com.codearena.codearena_backend.entity.ProblemHint> getHints(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") int count
    ) {
        return problemService.getHints(id, count);
    }

    @GetMapping("/{id}/editorial")
    public java.util.Map<String, Object> getEditorial(@PathVariable Long id) {
        return problemService.getEditorial(id);
    }

    @GetMapping("/{id}/starter-codes")
    public java.util.List<com.codearena.codearena_backend.entity.ProblemStarterCode> getStarterCodes(@PathVariable Long id) {
        return problemService.getStarterCodes(id);
    }
}