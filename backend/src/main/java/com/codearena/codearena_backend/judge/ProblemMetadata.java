package com.codearena.codearena_backend.judge;

import java.util.List;

public record ProblemMetadata(
        String title,
        String executionType,
        String className,
        String functionName,
        List<String> parameterNames,
        List<String> parameterTypes,
        String returnType
) {
}
