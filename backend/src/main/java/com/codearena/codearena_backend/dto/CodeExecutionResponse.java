package com.codearena.codearena_backend.dto;

public class CodeExecutionResponse {

    private String output;
    private String error;
    private String status;
    private Long executionTimeMs;

    public CodeExecutionResponse() {
    }

    public CodeExecutionResponse(String output, String error, String status) {
        this.output = output;
        this.error = error;
        this.status = status;
    }

    public CodeExecutionResponse(String output, String error, String status, Long executionTimeMs) {
        this.output = output;
        this.error = error;
        this.status = status;
        this.executionTimeMs = executionTimeMs;
    }

    public String getOutput() {
        return output;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getExecutionTimeMs() {
        return executionTimeMs;
    }

    public void setExecutionTimeMs(Long executionTimeMs) {
        this.executionTimeMs = executionTimeMs;
    }
}
