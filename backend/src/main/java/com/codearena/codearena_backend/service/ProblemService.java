package com.codearena.codearena_backend.service;

import com.codearena.codearena_backend.dto.ProblemRequest;
import com.codearena.codearena_backend.entity.Problem;
import com.codearena.codearena_backend.entity.ProblemHint;
import com.codearena.codearena_backend.entity.User;
import com.codearena.codearena_backend.enumtype.UserRole;
import com.codearena.codearena_backend.repository.ProblemRepository;
import com.codearena.codearena_backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@org.springframework.transaction.annotation.Transactional
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final com.codearena.codearena_backend.repository.ProblemHintRepository problemHintRepository;

    public ProblemService(ProblemRepository problemRepository, UserRepository userRepository, com.codearena.codearena_backend.repository.ProblemHintRepository problemHintRepository) {
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
        this.problemHintRepository = problemHintRepository;
    }

    public Problem createProblem(ProblemRequest request) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Access Denied: You must be logged in as a Host Admin (`ADMIN`) to create problems.");
        }

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Access Denied: Solvers cannot create problems. Only Host Admins can create problems.");
        }

        Problem problem = new Problem();
        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setDifficulty(request.getDifficulty());
        problem.setTags(request.getTags());
        problem.setEditorialMd(request.getEditorialMd());
        
        List<ProblemHint> hintEntities = new ArrayList<>();
        if (request.getHints() != null) {
            int hintNum = 1;
            for (String hintText : request.getHints()) {
                ProblemHint hint = new ProblemHint();
                hint.setProblem(problem);
                hint.setHintNumber(hintNum++);
                hint.setHintText(hintText);
                hintEntities.add(hint);
            }
        }
        problem.setHints(hintEntities);

        return problemRepository.save(problem);
    }

    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    public Problem updateProblem(Long id, ProblemRequest request) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Access Denied: You must be logged in as a Host Admin (`ADMIN`) to update problems.");
        }

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Access Denied: Solvers cannot update problems. Only Host Admins can update problems.");
        }

        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
                
        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setDifficulty(request.getDifficulty());
        problem.setTags(request.getTags());
        problem.setEditorialMd(request.getEditorialMd());

        if (request.getFunctionName() != null && !request.getFunctionName().isBlank()) {
            problem.setFunctionName(request.getFunctionName());
        }
        if (request.getParameterNames() != null && !request.getParameterNames().isBlank()) {
            problem.setParameterNames(request.getParameterNames());
        }
        if (request.getParameterTypes() != null && !request.getParameterTypes().isBlank()) {
            problem.setParameterTypes(request.getParameterTypes());
        }
        if (request.getReturnType() != null && !request.getReturnType().isBlank()) {
            problem.setReturnType(request.getReturnType());
        }

        // Delete old hints directly in the DB to avoid Hibernate flush order issues
        problemHintRepository.deleteByProblemId(problem.getId());
        problem.getHints().clear();

        List<ProblemHint> newHintEntities = new ArrayList<>();
        if (request.getHints() != null) {
            int hintNum = 1;
            for (String hintText : request.getHints()) {
                ProblemHint hint = new ProblemHint();
                hint.setProblem(problem);
                hint.setHintNumber(hintNum++);
                hint.setHintText(hintText);
                newHintEntities.add(hint);
            }
        }
        problem.getHints().addAll(newHintEntities);

        return problemRepository.save(problem);
    }

    public Problem getProblemById(Long id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
    }

    public void deleteProblem(Long id) {
        problemRepository.deleteById(id);
    }

    public java.util.Optional<Problem> getProblemByTitle(String title) {
        return problemRepository.findByTitleIgnoreCase(title);
    }
}