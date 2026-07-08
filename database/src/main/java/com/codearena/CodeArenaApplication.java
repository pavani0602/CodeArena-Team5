package com.codearena;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the CodeArena Spring Boot application.
 * <p>
 * Bootstraps the application context, triggers Flyway database migrations,
 * and starts the embedded web server.
 * </p>
 */
@SpringBootApplication
public class CodeArenaApplication {

    public static void main(String[] args) {
        SpringApplication.run(CodeArenaApplication.class, args);
    }
}
