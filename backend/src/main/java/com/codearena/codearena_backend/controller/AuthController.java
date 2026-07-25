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

    @PostMapping("/forgot-password")
    public java.util.Map<String, String> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        return authService.forgotPassword(request.get("email"), request.get("role"));
    }

    @PostMapping("/reset-password")
    public java.util.Map<String, String> resetPassword(@RequestBody java.util.Map<String, String> request) {
        authService.resetPassword(request.get("token"), request.get("newPassword"));
        return java.util.Map.of("message", "Password reset successfully");
    }

    @GetMapping("/me")
    public AuthResponse getMe() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof com.codearena.codearena_backend.entity.User user) {
            return new AuthResponse(null, user.getUsername(), user.getRole().name());
        }
        throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Not authenticated");
    }

}