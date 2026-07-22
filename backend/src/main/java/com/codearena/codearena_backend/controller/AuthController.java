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

    @GetMapping("/me")
    public AuthResponse getMe() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof com.codearena.codearena_backend.entity.User user) {
            return new AuthResponse(null, user.getUsername(), user.getRole().name());
        }
        throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Not authenticated");
    }

    @GetMapping("/debug-users")
    public java.util.List<java.util.Map<String, Object>> debugUsers(@org.springframework.beans.factory.annotation.Autowired com.codearena.codearena_backend.repository.UserRepository userRepository) {
        return userRepository.findAll().stream().map(u -> java.util.Map.of(
            "id", (Object) u.getId(),
            "username", (Object) u.getUsername(),
            "email", (Object) u.getEmail(),
            "role", (Object) u.getRole()
        )).toList();
    }

    @ExceptionHandler(org.springframework.web.server.ResponseStatusException.class)
    public org.springframework.http.ResponseEntity<java.util.Map<String, String>> handleResponseStatusException(org.springframework.web.server.ResponseStatusException e) {
        String message = e.getReason() != null ? e.getReason() : e.getMessage();
        return org.springframework.http.ResponseEntity.status(e.getStatusCode()).body(java.util.Map.of("message", message));
    }

    @ExceptionHandler(RuntimeException.class)
    public org.springframework.http.ResponseEntity<java.util.Map<String, String>> handleRuntimeException(RuntimeException e) {
        org.springframework.http.HttpStatus status = org.springframework.http.HttpStatus.BAD_REQUEST;
        if ("Invalid username or password".equals(e.getMessage()) || "Not authenticated".equals(e.getMessage())) {
            status = org.springframework.http.HttpStatus.UNAUTHORIZED;
        }
        return org.springframework.http.ResponseEntity.status(status).body(java.util.Map.of("message", e.getMessage()));
    }
}