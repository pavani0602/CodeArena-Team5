package com.codearena.codearena_backend.controller;

import com.codearena.codearena_backend.dto.SubmissionRequest;
import com.codearena.codearena_backend.entity.Submission;
import com.codearena.codearena_backend.entity.User;
import com.codearena.codearena_backend.enumtype.SubmissionStatus;
import com.codearena.codearena_backend.enumtype.UserRole;
import com.codearena.codearena_backend.service.SubmissionService;
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
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SubmissionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SubmissionService submissionService;

    private UsernamePasswordAuthenticationToken createMockAuth(String username) {
        User user = new User();
        user.setId(1L);
        user.setUsername(username);
        user.setEmail(username + "@example.com");
        user.setRole(UserRole.USER);

        return new UsernamePasswordAuthenticationToken(
                user, null, List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    // --- 1. POST /api/submissions/problem/{problemId} ---

    @Test
    @DisplayName("POST /api/submissions/problem/{problemId} - Unauthenticated request returns 401 Unauthorized")
    void createSubmission_Unauthenticated_ReturnsUnauthorized() throws Exception {
        SubmissionRequest request = new SubmissionRequest();
        request.setLanguage("JAVA");
        request.setCode("class Solution {}");

        mockMvc.perform(post("/api/submissions/problem/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/submissions/problem/{problemId} - Authenticated & valid request creates submission")
    void createSubmission_AuthenticatedAndValid_ReturnsSubmission() throws Exception {
        SubmissionRequest request = new SubmissionRequest();
        request.setLanguage("JAVA");
        request.setCode("class Solution {}");

        Submission submission = new Submission();
        submission.setLanguage("JAVA");
        submission.setCode("class Solution {}");
        submission.setStatus(SubmissionStatus.PENDING);

        when(submissionService.createSubmission(eq(1L), eq("testuser"), any(SubmissionRequest.class)))
                .thenReturn(submission);

        mockMvc.perform(post("/api/submissions/problem/1")
                        .with(authentication(createMockAuth("testuser")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.language").value("JAVA"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    @DisplayName("POST /api/submissions/problem/{problemId} - Rate limit exceeded returns 429 Too Many Requests")
    void createSubmission_LimitExceeded_ReturnsTooManyRequests() throws Exception {
        SubmissionRequest request = new SubmissionRequest();
        request.setLanguage("JAVA");
        request.setCode("class Solution {}");

        when(submissionService.createSubmission(eq(1L), eq("testuser"), any(SubmissionRequest.class)))
                .thenThrow(new RuntimeException("Submission limit exceeded: 5 submissions per 1 minute"));

        mockMvc.perform(post("/api/submissions/problem/1")
                        .with(authentication(createMockAuth("testuser")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    @DisplayName("POST /api/submissions/problem/{problemId} - Other service exception returns 500 Internal Server Error")
    void createSubmission_ServiceThrowsOtherException_ReturnsInternalServerError() throws Exception {
        SubmissionRequest request = new SubmissionRequest();
        request.setLanguage("JAVA");
        request.setCode("class Solution {}");

        when(submissionService.createSubmission(eq(1L), eq("testuser"), any(SubmissionRequest.class)))
                .thenThrow(new RuntimeException("Problem not found with id: 1"));

        mockMvc.perform(post("/api/submissions/problem/1")
                        .with(authentication(createMockAuth("testuser")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @DisplayName("POST /api/submissions/problem/{problemId} - Invalid problemId format returns 400 Bad Request")
    void createSubmission_InvalidProblemId_ReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/submissions/problem/invalid")
                        .with(authentication(createMockAuth("testuser")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/submissions/problem/{problemId} - Malformed JSON returns 400 Bad Request")
    void createSubmission_MalformedJson_ReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/submissions/problem/1")
                        .with(authentication(createMockAuth("testuser")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{invalid-json"))
                .andExpect(status().isBadRequest());
    }

    // --- 2. GET /api/submissions/problem/{problemId} ---

    @Test
    @DisplayName("GET /api/submissions/problem/{problemId} - Unauthenticated request returns 401 Unauthorized")
    void getSubmissionsByProblem_Unauthenticated_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/submissions/problem/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/submissions/problem/{problemId} - Authenticated request returns list of submissions")
    void getSubmissionsByProblem_AuthenticatedAndValid_ReturnsSubmissions() throws Exception {
        Submission sub1 = new Submission();
        sub1.setLanguage("JAVA");
        sub1.setStatus(SubmissionStatus.ACCEPTED);

        Submission sub2 = new Submission();
        sub2.setLanguage("PYTHON");
        sub2.setStatus(SubmissionStatus.WRONG_ANSWER);

        when(submissionService.getSubmissionsByProblemIdAndUsername(1L, "testuser"))
                .thenReturn(List.of(sub1, sub2));

        mockMvc.perform(get("/api/submissions/problem/1")
                        .with(authentication(createMockAuth("testuser"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].language").value("JAVA"))
                .andExpect(jsonPath("$[0].status").value("ACCEPTED"))
                .andExpect(jsonPath("$[1].language").value("PYTHON"))
                .andExpect(jsonPath("$[1].status").value("WRONG_ANSWER"));
    }

    @Test
    @DisplayName("GET /api/submissions/problem/{problemId} - Invalid problemId format returns 400 Bad Request")
    void getSubmissionsByProblem_InvalidProblemId_ReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/submissions/problem/invalid")
                        .with(authentication(createMockAuth("testuser"))))
                .andExpect(status().isBadRequest());
    }

    // --- 3. GET /api/submissions/statuses ---

    @Test
    @DisplayName("GET /api/submissions/statuses - Unauthenticated request returns 401 Unauthorized")
    void getProblemStatuses_Unauthenticated_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/submissions/statuses"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/submissions/statuses - Authenticated request returns problem status map")
    void getProblemStatuses_AuthenticatedAndValid_ReturnsStatusMap() throws Exception {
        when(submissionService.getProblemStatusesForUser("testuser"))
                .thenReturn(Map.of(1L, "ACCEPTED", 2L, "WRONG_ANSWER"));

        mockMvc.perform(get("/api/submissions/statuses")
                        .with(authentication(createMockAuth("testuser"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.1").value("ACCEPTED"))
                .andExpect(jsonPath("$.2").value("WRONG_ANSWER"));
    }

    @Test
    @DisplayName("GET /api/submissions/statuses - Service exception returns 500 Internal Server Error")
    void getProblemStatuses_ServiceThrowsException_ReturnsInternalServerError() throws Exception {
        when(submissionService.getProblemStatusesForUser("testuser"))
                .thenThrow(new RuntimeException("Database error"));

        mockMvc.perform(get("/api/submissions/statuses")
                        .with(authentication(createMockAuth("testuser"))))
                .andExpect(status().isInternalServerError());
    }

    // --- 4. GET /api/submissions/summary ---

    @Test
    @DisplayName("GET /api/submissions/summary - Unauthenticated request returns 401 Unauthorized")
    void getUserSummary_Unauthenticated_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/submissions/summary"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/submissions/summary - Authenticated request returns summary map")
    void getUserSummary_AuthenticatedAndValid_ReturnsSummaryMap() throws Exception {
        when(submissionService.getUserSummary("testuser"))
                .thenReturn(Map.of("totalSubmissions", 10, "solvedCount", 5));

        mockMvc.perform(get("/api/submissions/summary")
                        .with(authentication(createMockAuth("testuser"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSubmissions").value(10))
                .andExpect(jsonPath("$.solvedCount").value(5));
    }

    @Test
    @DisplayName("GET /api/submissions/summary - Service exception returns 500 Internal Server Error")
    void getUserSummary_ServiceThrowsException_ReturnsInternalServerError() throws Exception {
        when(submissionService.getUserSummary("testuser"))
                .thenThrow(new RuntimeException("Error calculating summary"));

        mockMvc.perform(get("/api/submissions/summary")
                        .with(authentication(createMockAuth("testuser"))))
                .andExpect(status().isInternalServerError());
    }
}
