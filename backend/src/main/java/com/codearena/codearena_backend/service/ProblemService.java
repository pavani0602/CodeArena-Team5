package com.codearena.codearena_backend.service;

import com.codearena.codearena_backend.dto.ProblemRequest;
import com.codearena.codearena_backend.entity.Problem;
import com.codearena.codearena_backend.entity.User;
import com.codearena.codearena_backend.enumtype.UserRole;
import com.codearena.codearena_backend.repository.ProblemRepository;
import com.codearena.codearena_backend.repository.ProblemHintRepository;
import com.codearena.codearena_backend.repository.ProblemStarterCodeRepository;
import com.codearena.codearena_backend.repository.SubmissionRepository;
import com.codearena.codearena_backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final ProblemHintRepository problemHintRepository;
    private final ProblemStarterCodeRepository problemStarterCodeRepository;
    private final SubmissionRepository submissionRepository;

    public ProblemService(ProblemRepository problemRepository, UserRepository userRepository,
                          ProblemHintRepository problemHintRepository,
                          ProblemStarterCodeRepository problemStarterCodeRepository,
                          SubmissionRepository submissionRepository) {
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
        this.problemHintRepository = problemHintRepository;
        this.problemStarterCodeRepository = problemStarterCodeRepository;
        this.submissionRepository = submissionRepository;
    }

    public Problem createProblem(ProblemRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User user)) {
            throw new RuntimeException("Access Denied: You must be logged in as a Host Admin (`ADMIN`) to create problems.");
        }

        User dbUser = userRepository.findByUsernameIgnoreCase(user.getUsername()).orElse(user);
        if (dbUser.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Access Denied: Solvers cannot create problems. Only Host Admins can create problems.");
        }

        Problem problem = new Problem();
        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setDifficulty(request.getDifficulty());
        problem.setTags(request.getTags());

        return problemRepository.save(problem);
    }

    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    public Problem getProblemById(Long id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
    }
    public java.util.List<com.codearena.codearena_backend.entity.ProblemHint> getHints(Long problemId, int count) {
        java.util.List<com.codearena.codearena_backend.entity.ProblemHint> allHints =
                problemHintRepository.findByProblemIdOrderByHintNumberAsc(problemId);
        return allHints.stream().limit(count).toList();
    }

    public java.util.Map<String, Object> getEditorial(Long problemId) {
        Problem problem = getProblemById(problemId);
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("editorial", problem.getEditorial());
        result.put("available", problem.getEditorial() != null && !problem.getEditorial().isEmpty());
        return result;
    }

    public java.util.List<com.codearena.codearena_backend.entity.ProblemStarterCode> getStarterCodes(Long problemId) {
        return problemStarterCodeRepository.findByProblemId(problemId);
    }
}