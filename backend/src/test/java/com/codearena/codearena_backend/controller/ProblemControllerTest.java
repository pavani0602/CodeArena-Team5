package com.codearena.codearena_backend.controller;

import com.codearena.codearena_backend.dto.ProblemRequest;
import com.codearena.codearena_backend.entity.Problem;
import com.codearena.codearena_backend.enumtype.DifficultyLevel;
import com.codearena.codearena_backend.service.ProblemService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ProblemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProblemService problemService;

    // --- 1. POST /api/problems ---

    @Test
    @DisplayName("POST /api/problems - Valid request creates and returns problem")
    void createProblem_ValidRequest_ReturnsCreatedProblem() throws Exception {
        ProblemRequest request = new ProblemRequest();
        request.setTitle("Two Sum");
        request.setDescription("Find two numbers");
        request.setDifficulty(DifficultyLevel.EASY);
        request.setTags("array,hashmap");
        request.setEditorialMd("# Solution");
        request.setHints(List.of("Use hashmap"));

        Problem createdProblem = new Problem();
        createdProblem.setTitle("Two Sum");
        createdProblem.setDescription("Find two numbers");
        createdProblem.setDifficulty(DifficultyLevel.EASY);
        createdProblem.setTags("array,hashmap");

        when(problemService.createProblem(any(ProblemRequest.class))).thenReturn(createdProblem);

        mockMvc.perform(post("/api/problems")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Two Sum"))
                .andExpect(jsonPath("$.difficulty").value("EASY"));
    }

    @Test
    @DisplayName("POST /api/problems - Service exception returns 500 Internal Server Error")
    void createProblem_ServiceThrowsException_ReturnsInternalServerError() throws Exception {
        ProblemRequest request = new ProblemRequest();
        request.setTitle("Two Sum");

        when(problemService.createProblem(any(ProblemRequest.class)))
                .thenThrow(new RuntimeException("Error creating problem"));

        mockMvc.perform(post("/api/problems")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @DisplayName("POST /api/problems - Malformed JSON returns 400 Bad Request")
    void createProblem_MalformedJson_ReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/problems")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{invalid-json"))
                .andExpect(status().isBadRequest());
    }

    // --- 2. GET /api/problems/metadata/{title} ---

    @Test
    @DisplayName("GET /api/problems/metadata/{title} - Found title returns 200 OK with metadata")
    void getMetadata_FoundTitle_ReturnsOkWithMetadata() throws Exception {
        Problem problem = new Problem();
        problem.setTitle("Two Sum");
        problem.setFunctionName("twoSum");
        problem.setParameterNames("nums,target");
        problem.setParameterTypes("int[],int");
        problem.setReturnType("int[]");

        when(problemService.getProblemByTitle("Two Sum")).thenReturn(Optional.of(problem));

        mockMvc.perform(get("/api/problems/metadata/Two Sum"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Two Sum"))
                .andExpect(jsonPath("$.functionName").value("twoSum"));
    }

    @Test
    @DisplayName("GET /api/problems/metadata/{title} - Unknown title returns 404 Not Found")
    void getMetadata_UnknownTitle_ReturnsNotFound() throws Exception {
        when(problemService.getProblemByTitle("Unknown Problem")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/problems/metadata/Unknown Problem"))
                .andExpect(status().isNotFound());
    }

    // --- 3. GET /api/problems ---

    @Test
    @DisplayName("GET /api/problems - Returns list of all problems")
    void getAllProblems_ValidRequest_ReturnsProblemList() throws Exception {
        Problem p1 = new Problem();
        p1.setTitle("Two Sum");

        Problem p2 = new Problem();
        p2.setTitle("Reverse String");

        when(problemService.getAllProblems()).thenReturn(List.of(p1, p2));

        mockMvc.perform(get("/api/problems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Two Sum"))
                .andExpect(jsonPath("$[1].title").value("Reverse String"));
    }

    @Test
    @DisplayName("GET /api/problems - Empty list returns 200 OK with empty array")
    void getAllProblems_EmptyList_ReturnsEmptyArray() throws Exception {
        when(problemService.getAllProblems()).thenReturn(List.of());

        mockMvc.perform(get("/api/problems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    @DisplayName("GET /api/problems - Service exception returns 500 Internal Server Error")
    void getAllProblems_ServiceThrowsException_ReturnsInternalServerError() throws Exception {
        when(problemService.getAllProblems()).thenThrow(new RuntimeException("Database error"));

        mockMvc.perform(get("/api/problems"))
                .andExpect(status().isInternalServerError());
    }

    // --- 4. GET /api/problems/{id} ---

    @Test
    @DisplayName("GET /api/problems/{id} - Existing id returns problem")
    void getProblemById_ExistingId_ReturnsProblem() throws Exception {
        Problem problem = new Problem();
        problem.setTitle("Two Sum");

        when(problemService.getProblemById(1L)).thenReturn(problem);

        mockMvc.perform(get("/api/problems/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Two Sum"));
    }

    @Test
    @DisplayName("GET /api/problems/{id} - Non-existing id returns 404 Not Found")
    void getProblemById_NonExistingId_ReturnsNotFound() throws Exception {
        when(problemService.getProblemById(999L))
                .thenThrow(new RuntimeException("Problem not found with id: 999"));

        mockMvc.perform(get("/api/problems/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/problems/{id} - Database error returns 500 Internal Server Error")
    void getProblemById_DatabaseError_ReturnsInternalServerError() throws Exception {
        when(problemService.getProblemById(1L))
                .thenThrow(new RuntimeException("Database connection failure"));

        mockMvc.perform(get("/api/problems/1"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @DisplayName("GET /api/problems/{id} - Invalid id parameter returns 400 Bad Request")
    void getProblemById_InvalidIdType_ReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/problems/invalid-id"))
                .andExpect(status().isBadRequest());
    }

    // --- 5. PUT /api/problems/{id} ---

    @Test
    @DisplayName("PUT /api/problems/{id} - Valid request updates and returns problem")
    void updateProblem_ValidRequest_ReturnsUpdatedProblem() throws Exception {
        ProblemRequest request = new ProblemRequest();
        request.setTitle("Updated Two Sum");
        request.setDescription("Updated desc");
        request.setDifficulty(DifficultyLevel.MEDIUM);

        Problem updatedProblem = new Problem();
        updatedProblem.setTitle("Updated Two Sum");
        updatedProblem.setDifficulty(DifficultyLevel.MEDIUM);

        when(problemService.updateProblem(eq(1L), any(ProblemRequest.class))).thenReturn(updatedProblem);

        mockMvc.perform(put("/api/problems/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Two Sum"))
                .andExpect(jsonPath("$.difficulty").value("MEDIUM"));
    }

    @Test
    @DisplayName("PUT /api/problems/{id} - Non-existing id returns 404 Not Found")
    void updateProblem_NonExistingId_ReturnsNotFound() throws Exception {
        ProblemRequest request = new ProblemRequest();
        request.setTitle("Updated Title");

        when(problemService.updateProblem(eq(999L), any(ProblemRequest.class)))
                .thenThrow(new RuntimeException("Problem not found with id: 999"));

        mockMvc.perform(put("/api/problems/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("PUT /api/problems/{id} - Database error returns 500 Internal Server Error")
    void updateProblem_DatabaseError_ReturnsInternalServerError() throws Exception {
        ProblemRequest request = new ProblemRequest();
        request.setTitle("Updated Title");

        when(problemService.updateProblem(eq(1L), any(ProblemRequest.class)))
                .thenThrow(new RuntimeException("Database error occurred"));

        mockMvc.perform(put("/api/problems/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @DisplayName("PUT /api/problems/{id} - Invalid id parameter returns 400 Bad Request")
    void updateProblem_InvalidIdType_ReturnsBadRequest() throws Exception {
        mockMvc.perform(put("/api/problems/not-a-number")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("PUT /api/problems/{id} - Malformed JSON returns 400 Bad Request")
    void updateProblem_MalformedJson_ReturnsBadRequest() throws Exception {
        mockMvc.perform(put("/api/problems/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{invalid-json"))
                .andExpect(status().isBadRequest());
    }
}
