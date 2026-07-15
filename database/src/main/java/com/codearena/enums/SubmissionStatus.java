package com.codearena.enums;

/**
 * Represents the current status of a code submission as it moves
 * through the evaluation pipeline.
 * <ul>
 *     <li>{@link #PENDING}                — Queued, not yet picked up by the judge.</li>
 *     <li>{@link #RUNNING}                — Currently being executed against test cases.</li>
 *     <li>{@link #ACCEPTED}               — All test cases passed.</li>
 *     <li>{@link #WRONG_ANSWER}           — At least one test case produced incorrect output.</li>
 *     <li>{@link #TIME_LIMIT_EXCEEDED}    — Execution exceeded the allowed time limit.</li>
 *     <li>{@link #MEMORY_LIMIT_EXCEEDED}  — Execution exceeded the allowed memory limit.</li>
 *     <li>{@link #RUNTIME_ERROR}          — An unhandled exception or crash occurred.</li>
 *     <li>{@link #COMPILATION_ERROR}      — Source code failed to compile.</li>
 * </ul>
 */
public enum SubmissionStatus {
    PENDING,
    RUNNING,
    ACCEPTED,
    WRONG_ANSWER,
    TIME_LIMIT_EXCEEDED,
    MEMORY_LIMIT_EXCEEDED,
    RUNTIME_ERROR,
    COMPILATION_ERROR
}
