package com.codearena.codearena_backend.judge;

public record ExecutionResult(
        JudgeVerdict verdict,
        String output,
        String error,
        Long executionTimeMs
) {
    public boolean succeeded() {
        return verdict == JudgeVerdict.ACCEPTED;
    }
}
