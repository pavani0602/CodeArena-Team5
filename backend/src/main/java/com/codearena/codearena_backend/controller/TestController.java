package com.codearena.codearena_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test/public")
    public String publicTest() {
        return "Public API is working";
    }

    @GetMapping("/api/test/protected")
    public String protectedTest() {
        return "Protected API is working with JWT token";
    }
}