package com.codearena.codearena_backend.service;

import com.codearena.codearena_backend.dto.CodeExecutionRequest;
import com.codearena.codearena_backend.dto.CodeExecutionResponse;
import com.codearena.codearena_backend.entity.Problem;
import com.codearena.codearena_backend.entity.TestCase;
import com.codearena.codearena_backend.judge.ExecutionResult;
import com.codearena.codearena_backend.judge.ExecutionService;
import com.codearena.codearena_backend.judge.JudgeResult;
import com.codearena.codearena_backend.judge.JudgeService;
import com.codearena.codearena_backend.judge.JudgeVerdict;
import com.codearena.codearena_backend.repository.ProblemRepository;
import com.codearena.codearena_backend.repository.TestCaseRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;

@Service
public class CodeExecutionService {


    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final JudgeService judgeService;
    private final ExecutionService executionService;

    public CodeExecutionService(
            ProblemRepository problemRepository,
            TestCaseRepository testCaseRepository,
            JudgeService judgeService,
            ExecutionService executionService
    ) {
        this.problemRepository = problemRepository;
        this.testCaseRepository = testCaseRepository;
        this.judgeService = judgeService;
        this.executionService = executionService;
    }


    public CodeExecutionResponse executeCode(CodeExecutionRequest request) {
        if (request.getLanguage() == null || request.getLanguage().isBlank()) {
            return new CodeExecutionResponse("", "Language is required", "ERROR");
        }

        if (request.getCode() == null || request.getCode().isBlank()) {
            return new CodeExecutionResponse("", "Code is required", "ERROR");
        }

        if (request.getProblemId() != null) {
            return executeFunctionSample(request);
        }

        ExecutionResult result = executionService.execute(request.getLanguage(), request.getCode());
        return new CodeExecutionResponse(result.output(), result.error(), toApiStatus(result.verdict()), result.executionTimeMs());
    }

    private CodeExecutionResponse executeFunctionSample(CodeExecutionRequest request) {
        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        TestCase sample = testCaseRepository.findByProblemId(problem.getId()).stream()
                .filter(testCase -> !Boolean.TRUE.equals(testCase.getHidden()))
                .min(Comparator.comparing(TestCase::getId))
                .orElseThrow(() -> new RuntimeException("No visible sample test case found"));

        JudgeResult result = judgeService.judge(problem, sample, request.getLanguage(), request.getCode());

        return new CodeExecutionResponse(
                result.getActualOutput(),
                result.getErrorMessage(),
                toApiStatus(result.getVerdict()),
                result.getExecutionTimeMs(),
                result.getExpectedOutput()
        );
    }

private String toApiStatus(JudgeVerdict verdict) {
    if (verdict == JudgeVerdict.ACCEPTED) {
        return "SUCCESS";
    }
    return verdict.name();
}


}