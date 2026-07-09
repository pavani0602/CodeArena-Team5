package com.codearena.codearena_backend.controller;

import com.codearena.codearena_backend.dto.CodeExecutionRequest;
import com.codearena.codearena_backend.dto.CodeExecutionResponse;
import com.codearena.codearena_backend.service.CodeExecutionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/execute")
public class CodeExecutionController {

    private final CodeExecutionService codeExecutionService;

    public CodeExecutionController(CodeExecutionService codeExecutionService) {
        this.codeExecutionService = codeExecutionService;
    }

    @PostMapping
    public CodeExecutionResponse executeCode(@RequestBody CodeExecutionRequest request) {
        return codeExecutionService.executeCode(request);
    }
}