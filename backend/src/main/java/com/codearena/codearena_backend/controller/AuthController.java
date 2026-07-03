package com.codearena.codearena_backend.controller;

import com.codearena.codearena_backend.dto.AuthResponse;
import com.codearena.codearena_backend.dto.LoginRequest;
import com.codearena.codearena_backend.dto.RegisterRequest;
import com.codearena.codearena_backend.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}