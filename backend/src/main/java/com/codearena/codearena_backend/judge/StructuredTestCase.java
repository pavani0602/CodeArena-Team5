package com.codearena.codearena_backend.judge;

import java.util.List;

public record StructuredTestCase(
        List<Object> arguments,
        Object expected
) {
}
