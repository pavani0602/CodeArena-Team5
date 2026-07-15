package com.codearena.codearena_backend.judge;

import com.codearena.codearena_backend.entity.Problem;
import com.codearena.codearena_backend.entity.TestCase;
import org.springframework.stereotype.Service;

@Service
public class JudgeService {

    private final ProblemMetadataService problemMetadataService;
    private final TestCaseDataParser testCaseDataParser;
    private final DriverGenerator driverGenerator;
    private final ExecutionService executionService;
    private final OutputComparator outputComparator;

    public JudgeService(
            ProblemMetadataService problemMetadataService,
            TestCaseDataParser testCaseDataParser,
            DriverGenerator driverGenerator,
            ExecutionService executionService,
            OutputComparator outputComparator
    ) {
        this.problemMetadataService = problemMetadataService;
        this.testCaseDataParser = testCaseDataParser;
        this.driverGenerator = driverGenerator;
        this.executionService = executionService;
        this.outputComparator = outputComparator;
    }

    public JudgeResult judge(Problem problem, TestCase testCase, String language, String userCode) {
        ProblemMetadata metadata = problemMetadataService.findByTitle(problem.getTitle())
                .orElseThrow(() -> new IllegalArgumentException("No judge metadata configured for problem: " + problem.getTitle()));

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
