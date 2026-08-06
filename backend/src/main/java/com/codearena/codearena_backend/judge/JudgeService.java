package com.codearena.codearena_backend.judge;

import com.codearena.codearena_backend.entity.Problem;
import com.codearena.codearena_backend.entity.TestCase;
import org.springframework.stereotype.Service;

@Service
public class JudgeService {

    private final TestCaseDataParser testCaseDataParser;
    private final DriverGenerator driverGenerator;
    private final ExecutionService executionService;
    private final OutputComparator outputComparator;

    public JudgeService(
            TestCaseDataParser testCaseDataParser,
            DriverGenerator driverGenerator,
            ExecutionService executionService,
            OutputComparator outputComparator
    ) {
        this.testCaseDataParser = testCaseDataParser;
        this.driverGenerator = driverGenerator;
        this.executionService = executionService;
        this.outputComparator = outputComparator;
    }

    public JudgeResult judge(Problem problem, TestCase testCase, String language, String userCode) {
        ProblemMetadata metadata = new ProblemMetadata(
                problem.getTitle(),
                "FUNCTION",
                "Solution",
                problem.getFunctionName(),
                java.util.Arrays.asList(problem.getParameterNames().split(",")),
                java.util.Arrays.asList(problem.getParameterTypes().split(",")),
                problem.getReturnType()
        );

        StructuredTestCase structuredTestCase = testCaseDataParser.parse(
                metadata,
                testCase.getInputData(),
                testCase.getExpectedOutput()
        );

        String expectedJson = outputComparator.toDisplayJson(structuredTestCase.expected());
        String sourceCode = driverGenerator.generate(language, userCode, metadata, structuredTestCase);
        ExecutionResult executionResult = executionService.execute(language, sourceCode);

        if (!executionResult.succeeded()) {
            return new JudgeResult(
                    executionResult.verdict(),
                    false,
                    executionResult.output(),
                    expectedJson,
                    executionResult.error(),
                    executionResult.executionTimeMs()
            );
        }

        boolean passed = outputComparator.matches(metadata, executionResult.output(), structuredTestCase.expected());
        return new JudgeResult(
                passed ? JudgeVerdict.ACCEPTED : JudgeVerdict.WRONG_ANSWER,
                passed,
                executionResult.output(),
                expectedJson,
                passed ? "" : "Expected " + expectedJson + " but got " + executionResult.output(),
                executionResult.executionTimeMs()
        );
    }
}
