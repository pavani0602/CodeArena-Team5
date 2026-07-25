package com.codearena.codearena_backend.controller;

import com.codearena.codearena_backend.dto.AnalyticsResponse;
import com.codearena.codearena_backend.repository.ProblemRepository;
import com.codearena.codearena_backend.repository.SubmissionRepository;
import com.codearena.codearena_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;

@RestController
@RequestMapping("/api/admin/analytics")
public class AnalyticsController {

    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;

    @Autowired
    public AnalyticsController(UserRepository userRepository, ProblemRepository problemRepository, SubmissionRepository submissionRepository) {
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.submissionRepository = submissionRepository;
    }

    @GetMapping
    public AnalyticsResponse getAnalytics() {
        long totalUsers = userRepository.count();
        long totalProblems = problemRepository.count();
        long totalSubmissions = submissionRepository.count();
        
        long uptimeMs = ManagementFactory.getRuntimeMXBean().getUptime();
        long uptimeSeconds = uptimeMs / 1000;
        
        return new AnalyticsResponse(totalUsers, totalProblems, totalSubmissions, uptimeSeconds, "Healthy");
    }
}
