package com.codearena.codearena_backend.controller;

import com.codearena.codearena_backend.dto.TestCaseRequest;
import com.codearena.codearena_backend.entity.TestCase;
import com.codearena.codearena_backend.service.TestCaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testcases")
public class TestCaseController {

    private final TestCaseService testCaseService;

    public TestCaseController(TestCaseService testCaseService) {
        this.testCaseService = testCaseService;
    }

    @PostMapping("/problem/{problemId}")
    public TestCase addTestCase(@PathVariable Long problemId, @RequestBody TestCaseRequest request) {
        return testCaseService.addTestCase(problemId, request);
    }

    @GetMapping("/problem/{problemId}")
    public List<TestCase> getTestCasesByProblem(@PathVariable Long problemId) {
        return testCaseService.getTestCasesByProblemId(problemId);
    }

    @DeleteMapping("/problem/{problemId}")
    public org.springframework.http.ResponseEntity<?> deleteTestCases(@PathVariable Long problemId) {
        testCaseService.deleteTestCasesByProblemId(problemId);
        return org.springframework.http.ResponseEntity.ok().build();
    }
}