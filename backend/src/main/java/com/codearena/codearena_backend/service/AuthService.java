package com.codearena.codearena_backend.service;

import com.codearena.codearena_backend.dto.AuthResponse;
import com.codearena.codearena_backend.dto.LoginRequest;
import com.codearena.codearena_backend.dto.RegisterRequest;
import com.codearena.codearena_backend.entity.User;
import com.codearena.codearena_backend.enumtype.UserRole;
import com.codearena.codearena_backend.repository.UserRepository;
import com.codearena.codearena_backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {

        String username = request.getUsername() != null ? request.getUsername().trim() : "";
        String email = request.getEmail() != null ? request.getEmail().trim() : "";

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Username already exists");
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Email already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        UserRole requestedRole = UserRole.USER;
        if (request.getRole() != null) {
            try {
                requestedRole = UserRole.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                // Ignore, defaults to USER
            }
        }
        
        if (requestedRole == UserRole.ADMIN && userRepository.existsByRole(UserRole.ADMIN)) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "An admin account already exists. Only one admin is allowed.");
        }
        
        user.setRole(requestedRole);

        userRepository.save(user);

        String token = jwtService.generateToken(user.getUsername());

        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {

        String input = request.getUsername() != null ? request.getUsername().trim() : "";

        java.util.Optional<User> userOpt = userRepository.findByUsernameIgnoreCase(input);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmailIgnoreCase(input);
        }
        User user = userOpt.orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }

        String token = jwtService.generateToken(user.getUsername());

        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }

    public java.util.Map<String, String> forgotPassword(String email, String role) {
        if (email == null || email.trim().isEmpty()) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Email is required");
        }
        
        userRepository.findByEmailIgnoreCase(email.trim());
        return java.util.Map.of("message", "If an account matching " + email + " exists, a recovery link has been sent.");
    }
}