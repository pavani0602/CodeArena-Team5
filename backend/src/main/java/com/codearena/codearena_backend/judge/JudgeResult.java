package com.codearena.codearena_backend.judge;

public class JudgeResult {

    private final JudgeVerdict verdict;
    private final boolean passed;
    private final String actualOutput;
    private final String expectedOutput;
    private final String errorMessage;
    private final Long executionTimeMs;

    public JudgeResult(JudgeVerdict verdict, boolean passed, String actualOutput, String expectedOutput, String errorMessage, Long executionTimeMs) {
        this.verdict = verdict;
        this.passed = passed;
        this.actualOutput = actualOutput;
        this.expectedOutput = expectedOutput;
        this.errorMessage = errorMessage;
        this.executionTimeMs = executionTimeMs;
    }

    public JudgeVerdict getVerdict() {
        return verdict;
    }

    public boolean isPassed() {
        return passed;
    }

    public String getActualOutput() {
        return actualOutput;
    }

    public String getExpectedOutput() {
        return expectedOutput;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public Long getExecutionTimeMs() {
        return executionTimeMs;
    }
}
