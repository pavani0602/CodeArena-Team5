package com.codearena.codearena_backend.dto;

public class CodeExecutionResponse {

    private String output;
    private String error;
    private String status;

    public CodeExecutionResponse() {
    }

    public CodeExecutionResponse(String output, String error, String status) {
        this.output = output;
        this.error = error;
        this.status = status;
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
}