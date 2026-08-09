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

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Collections;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        if (request.getRole() != null && (request.getRole().equalsIgnoreCase("ADMIN") || request.getRole().equalsIgnoreCase("HOST"))) {
            user.setRole(UserRole.ADMIN);
        } else {
            user.setRole(UserRole.USER);
        }

        userRepository.save(user);
        
        // Trigger Welcome Email asynchronously
        emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());

        String token = jwtService.generateToken(user.getUsername());

        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {

        java.util.Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(request.getUsername());
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
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Email address is required");
        }
        
        java.util.Optional<User> userOpt = userRepository.findByEmail(email.trim());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
            userRepository.save(user);
            
            return java.util.Map.of(
                "message", "If an account matching " + email + " exists, a recovery link has been sent."
            );
        }
        
        return java.util.Map.of("message", "If an account matching " + email + " exists, a recovery link has been sent.");
    }

    public void resetPassword(String token, String newPassword) {
        if (token == null || token.trim().isEmpty() || newPassword == null || newPassword.trim().isEmpty()) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Invalid token or password");
        }

        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Invalid or expired token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Token has expired");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    public AuthResponse googleLogin(String googleToken) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList("708164976846-ct35j10iohqoij0sig19cfhcmi0dgkvd.apps.googleusercontent.com"))
                .build();

            GoogleIdToken idToken = verifier.verify(googleToken);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                java.util.Optional<User> userOpt = userRepository.findByEmail(email);
                User user;
                if (userOpt.isEmpty()) {
                    user = new User();
                    // Basic fallback for username creation if email prefix is taken
                    String baseUsername = email.split("@")[0];
                    String username = baseUsername;
                    int suffix = 1;
                    while (userRepository.existsByUsername(username)) {
                        username = baseUsername + suffix;
                        suffix++;
                    }
                    user.setUsername(username);
                    user.setEmail(email);
                    user.setRole(UserRole.USER);
                    // Generate random secure password for OAuth users since they don't use it
                    user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
                    userRepository.save(user);
                    
                    try {
                        emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());
                    } catch (Exception ignored) { }
                } else {
                    user = userOpt.get();
                }

                String token = jwtService.generateToken(user.getUsername());
                return new AuthResponse(token, user.getUsername(), user.getRole().name());
            } else {
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid ID token.");
            }
        } catch (Exception e) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Google verification failed: " + e.getMessage());
        }
    }
}