package com.codearena.codearena_backend.controller;

import com.codearena.codearena_backend.dto.AuthResponse;
import com.codearena.codearena_backend.dto.LoginRequest;
import com.codearena.codearena_backend.dto.RegisterRequest;
import com.codearena.codearena_backend.entity.User;
import com.codearena.codearena_backend.enumtype.UserRole;
import com.codearena.codearena_backend.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    // --- 1. /api/auth/register ---

    @Test
    @DisplayName("POST /api/auth/register - Valid request returns AuthResponse")
    void register_ValidRequest_ReturnsAuthResponse() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setRole("USER");

        AuthResponse expectedResponse = new AuthResponse("mock-jwt-token", "testuser", "USER");
        when(authService.register(any(RegisterRequest.class))).thenReturn(expectedResponse);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    @DisplayName("POST /api/auth/register - Duplicate user returns 400 Bad Request")
    void register_UserAlreadyExists_ReturnsBadRequest() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new RuntimeException("Username already exists"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/auth/register - Service exception returns internal server error")
    void register_ServiceThrowsException_ReturnsInternalServerError() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new RuntimeException("Database error"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @DisplayName("POST /api/auth/register - Malformed JSON returns bad request")
    void register_MalformedJson_ReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{invalid-json"))
                .andExpect(status().isBadRequest());
    }

    // --- 2. /api/auth/login ---

    @Test
    @DisplayName("POST /api/auth/login - Valid request returns AuthResponse")
    void login_ValidRequest_ReturnsAuthResponse() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("password123");

        AuthResponse expectedResponse = new AuthResponse("login-jwt-token", "testuser", "USER");
        when(authService.login(any(LoginRequest.class))).thenReturn(expectedResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("login-jwt-token"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    @DisplayName("POST /api/auth/login - Bad credentials returns 401 Unauthorized")
    void login_InvalidCredentials_ReturnsUnauthorized() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("wrongpassword");

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("Invalid username or password"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/auth/login - Service exception returns internal server error")
    void login_ServiceThrowsException_ReturnsInternalServerError() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("password123");

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("Database error"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @DisplayName("POST /api/auth/login - Malformed JSON returns bad request")
    void login_MalformedJson_ReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("not-json"))
                .andExpect(status().isBadRequest());
    }

    // --- 3. /api/auth/forgot-password ---

    @Test
    @DisplayName("POST /api/auth/forgot-password - Valid request returns success map")
    void forgotPassword_ValidRequest_ReturnsSuccessMap() throws Exception {
        Map<String, String> request = Map.of("email", "test@example.com", "role", "USER");
        when(authService.forgotPassword("test@example.com", "USER"))
                .thenReturn(Map.of("message", "Password reset link sent successfully"));

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password reset link sent successfully"));
    }

    @Test
    @DisplayName("POST /api/auth/forgot-password - User not found returns 404 Not Found")
    void forgotPassword_UserNotFound_ReturnsNotFound() throws Exception {
        Map<String, String> request = Map.of("email", "unknown@example.com", "role", "USER");
        when(authService.forgotPassword("unknown@example.com", "USER"))
                .thenThrow(new RuntimeException("User with email unknown@example.com not found"));

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/auth/forgot-password - Service exception returns internal server error")
    void forgotPassword_ServiceThrowsException_ReturnsInternalServerError() throws Exception {
        Map<String, String> request = Map.of("email", "test@example.com", "role", "USER");
        when(authService.forgotPassword("test@example.com", "USER"))
                .thenThrow(new RuntimeException("Mail server unavailable"));

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @DisplayName("POST /api/auth/forgot-password - Malformed JSON returns bad request")
    void forgotPassword_MalformedJson_ReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{broken}"))
                .andExpect(status().isBadRequest());
    }

    // --- 4. /api/auth/reset-password ---

    @Test
    @DisplayName("POST /api/auth/reset-password - Valid token returns success message")
    void resetPassword_ValidToken_ReturnsSuccessMessage() throws Exception {
        Map<String, String> request = Map.of("token", "valid-token", "newPassword", "newPassword123");

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password reset successfully"));
    }

    @Test
    @DisplayName("POST /api/auth/reset-password - Invalid token returns internal server error")
    void resetPassword_InvalidToken_ReturnsInternalServerError() throws Exception {
        Map<String, String> request = Map.of("token", "invalid-token", "newPassword", "newPassword123");
        doThrow(new RuntimeException("Invalid or expired reset token"))
                .when(authService).resetPassword("invalid-token", "newPassword123");

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @DisplayName("POST /api/auth/reset-password - Malformed JSON returns bad request")
    void resetPassword_MalformedJson_ReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("bad-json"))
                .andExpect(status().isBadRequest());
    }

    // --- 5. /api/auth/me ---

    @Test
    @DisplayName("GET /api/auth/me - Unauthenticated request returns 401 Unauthorized")
    void getMe_Unauthenticated_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/auth/me - Authenticated request with User principal returns AuthResponse")
    void getMe_AuthenticatedWithUserPrincipal_ReturnsAuthResponse() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setUsername("meuser");
        user.setEmail("me@example.com");
        user.setRole(UserRole.USER);

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                user, null, List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );

        mockMvc.perform(get("/api/auth/me").with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("meuser"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    @WithMockUser(username = "stringUser")
    @DisplayName("GET /api/auth/me - Authenticated request with non-User principal returns 401 Unauthorized")
    void getMe_AuthenticatedWithNonUserPrincipal_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }
}
