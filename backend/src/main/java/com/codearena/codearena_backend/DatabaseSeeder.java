package com.codearena.codearena_backend;

import com.codearena.codearena_backend.entity.User;
import com.codearena.codearena_backend.enumtype.UserRole;
import com.codearena.codearena_backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
public class DatabaseSeeder {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    @Bean
    public CommandLineRunner seedDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            logger.info("Checking and seeding core database users...");

            // 1. Seed the core Admin User
            seedUserIfNotFound(
                    userRepository,
                    passwordEncoder,
                    "rounak_admin",
                    "rounak1700@gmail.com",
                    "12345678",
                    UserRole.ADMIN
            );

            // 2. Seed the core Test User
            seedUserIfNotFound(
                    userRepository,
                    passwordEncoder,
                    "Rounak Singh",
                    "rounakk1700@gmail.com",
                    "12345678",
                    UserRole.USER
            );

            logger.info("Database seeding completed.");
        };
    }

    private void seedUserIfNotFound(UserRepository userRepository, PasswordEncoder passwordEncoder, String username, String email, String rawPassword, UserRole role) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(rawPassword));
            user.setRole(role);
            userRepository.save(user);
            logger.info("Successfully seeded user: {} with role: {}", email, role.name());
        } else {
            logger.info("User {} already exists. Skipping seed.", email);
        }
    }
}
