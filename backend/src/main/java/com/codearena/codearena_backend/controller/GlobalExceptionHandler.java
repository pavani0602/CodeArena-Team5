package com.codearena.codearena_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

/**
 * Global exception handler for all controllers.
 * Converts RuntimeExceptions into proper HTTP responses
 * instead of leaking 500 stack traces.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatusException(ResponseStatusException e) {
        String message = e.getReason() != null ? e.getReason() : e.getMessage();
        return ResponseEntity.status(e.getStatusCode()).body(Map.of("message", message));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        String msg = e.getMessage() != null ? e.getMessage() : "Internal server error";

        // Map known error messages to proper HTTP status codes
        if (msg.contains("not found") || msg.contains("Not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", msg));
        }
        if (msg.contains("Invalid username or password") || msg.contains("Not authenticated")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", msg));
        }
        if (msg.contains("already exists")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", msg));
        }
        if (msg.contains("Submission limit exceeded")) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(Map.of("message", msg));
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", msg));
    }
}
