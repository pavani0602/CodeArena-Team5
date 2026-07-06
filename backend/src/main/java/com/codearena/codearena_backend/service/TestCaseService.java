package com.codearena.codearena_backend.service;

import com.codearena.codearena_backend.dto.TestCaseRequest;
import com.codearena.codearena_backend.entity.Problem;
import com.codearena.codearena_backend.entity.TestCase;
import com.codearena.codearena_backend.repository.ProblemRepository;
import com.codearena.codearena_backend.repository.TestCaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestCaseService {

    private final TestCaseRepository testCaseRepository;
    private final ProblemRepository problemRepository;

    public TestCaseService(TestCaseRepository testCaseRepository, ProblemRepository problemRepository) {
        this.testCaseRepository = testCaseRepository;
        this.problemRepository = problemRepository;
    }

    public TestCase addTestCase(Long problemId, TestCaseRequest request) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        TestCase testCase = new TestCase();
        testCase.setProblem(problem);
        testCase.setInputData(request.getInputData());
        testCase.setExpectedOutput(request.getExpectedOutput());
        testCase.setHidden(request.getHidden() != null ? request.getHidden() : false);

        return testCaseRepository.save(testCase);
    }

    public List<TestCase> getTestCasesByProblemId(Long problemId) {
        return testCaseRepository.findByProblemId(problemId);
    }
}