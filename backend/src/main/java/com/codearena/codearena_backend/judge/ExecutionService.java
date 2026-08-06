package com.codearena.codearena_backend.judge;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class ExecutionService {

    private final boolean isWindows = System.getProperty("os.name").toLowerCase().startsWith("windows");

    private ProcessBuilder createDockerBuilder(Path tempDir, String memory, String image, String... commands) {
        List<String> commandList = new ArrayList<>();
        if (isWindows) {
            commandList.add("cmd.exe");
            commandList.add("/c");
        }
        commandList.add("docker");
        commandList.add("run");
        commandList.add("--rm");
        commandList.add("-v");
        // On Windows with WSL/Docker Desktop, absolute paths are usually supported in volume binds.
        commandList.add(tempDir.toAbsolutePath().toString() + ":/app");
        commandList.add("-w");
        commandList.add("/app");
        commandList.add("--network");
        commandList.add("none");
        commandList.add("--memory");
        commandList.add(memory);
        commandList.add(image);
        commandList.addAll(Arrays.asList(commands));
        return new ProcessBuilder(commandList);
    }

    

    public ExecutionResult execute(String language, String sourceCode) {

System.out.println("Language received: " + language);
    String normalized = language == null ? "" : language.toUpperCase(Locale.ROOT);

    return switch (normalized) {
    case "PYTHON" -> executePython(sourceCode);
    case "JAVA" -> executeJava(sourceCode);
    case "CPP", "C++" -> executeCpp(sourceCode);
    case "JAVASCRIPT", "JS" -> executeJavaScript(sourceCode);

    default -> new ExecutionResult(
            JudgeVerdict.RUNTIME_ERROR,
            "",
            "Unsupported language: " + language,
            0L
    );
};
}

    private ExecutionResult executePython(String sourceCode) {
        Path tempDir = null;
        String containerName = "codearena-python-" + UUID.randomUUID().toString();
        try {
            tempDir = Files.createTempDirectory("codearena-judge-python-");
            Path sourceFile = tempDir.resolve("main.py");
            Files.writeString(sourceFile, sourceCode);

            ProcessBuilder runBuilder = createDockerBuilder(tempDir, "256m", "python:3.9-slim", "python", "main.py");
            return runProcess(runBuilder, 5);
        } catch (Exception e) {
            return new ExecutionResult(JudgeVerdict.RUNTIME_ERROR, "", e.getMessage(), 0L);
        } finally {
            cleanupContainer(containerName);
            deleteDirectory(tempDir);
        }
    }

    private ExecutionResult executeJava(String sourceCode) {
        Path tempDir = null;
        String containerName = "codearena-java-" + UUID.randomUUID().toString();
        try {
            tempDir = Files.createTempDirectory("codearena-judge-java-");
            Path sourceFile = tempDir.resolve("Main.java");
            Files.writeString(sourceFile, sourceCode);
            ProcessBuilder compileBuilder = createDockerBuilder(tempDir, "512m", "eclipse-temurin:17-jdk", "javac", "Main.java");
            
            
            ExecutionResult compileResult = runProcess(compileBuilder, 10);
            if (compileResult.verdict() == JudgeVerdict.TIME_LIMIT_EXCEEDED) {
                return new ExecutionResult(JudgeVerdict.COMPILATION_ERROR, "", "Compilation timeout", compileResult.executionTimeMs());
            }
            if (!compileResult.succeeded()) {
                return new ExecutionResult(JudgeVerdict.COMPILATION_ERROR, "", compileResult.error(), compileResult.executionTimeMs());
            }

            ProcessBuilder runBuilder = createDockerBuilder(tempDir, "256m", "eclipse-temurin:17-jdk", "java", "Main");
            return runProcess(runBuilder, 5);
        } catch (Exception e) {
            return new ExecutionResult(JudgeVerdict.RUNTIME_ERROR, "", e.getMessage(), 0L);
        } finally {
            cleanupContainer(containerName);
            deleteDirectory(tempDir);
        }
    }

    private ExecutionResult executeCpp(String sourceCode) {
        Path tempDir = null;
        String containerName = "codearena-cpp-" + UUID.randomUUID().toString();
        try {
            tempDir = Files.createTempDirectory("codearena-judge-cpp-");
            Path sourceFile = tempDir.resolve("main.cpp");
            Files.writeString(sourceFile, sourceCode);

            
            ProcessBuilder compileBuilder = createDockerBuilder(tempDir, "512m", "gcc:latest", "g++", "main.cpp", "-o", "main.exe");
            ExecutionResult compileResult = runProcess(compileBuilder, 15);
            if (compileResult.verdict() == JudgeVerdict.TIME_LIMIT_EXCEEDED) {
                return new ExecutionResult(JudgeVerdict.COMPILATION_ERROR, "", "Compilation timeout", compileResult.executionTimeMs());
            }
            if (!compileResult.succeeded()) {
                return new ExecutionResult(JudgeVerdict.COMPILATION_ERROR, "", compileResult.error(), compileResult.executionTimeMs());
            }

            ProcessBuilder runBuilder = createDockerBuilder(tempDir, "256m", "gcc:latest", "./main.exe");
            
            return runProcess(runBuilder, 5);
        } catch (Exception e) {
            return new ExecutionResult(JudgeVerdict.RUNTIME_ERROR, "", e.getMessage(), 0L);
        } finally {
            cleanupContainer(containerName);
            deleteDirectory(tempDir);
        }
    }
    private ExecutionResult executeJavaScript(String sourceCode) {
        System.out.println("Inside JavaScript execution");
    Path tempDir = null;

    try {
        tempDir = Files.createTempDirectory("codearena-judge-js-");

        Path sourceFile = tempDir.resolve("main.js");

        Files.writeString(sourceFile, sourceCode);

        ProcessBuilder runBuilder = createDockerBuilder(tempDir, "256m", "node:18-alpine", "node", "main.js");

        return runProcess(runBuilder, 5);

    } catch (Exception e) {

        return new ExecutionResult(
                JudgeVerdict.RUNTIME_ERROR,
                "",
                e.getMessage(),
                0L
        );

    } finally {

        deleteDirectory(tempDir);

    }
}

    
    

    private ExecutionResult runProcess(ProcessBuilder builder, int timeoutSeconds) throws IOException, InterruptedException {
        Process process = builder.start();
        long startedAt = System.nanoTime();
        boolean finished = process.waitFor(timeoutSeconds, TimeUnit.SECONDS);
        long elapsedMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startedAt);
        if (!finished) {
            process.destroyForcibly();
            return new ExecutionResult(JudgeVerdict.TIME_LIMIT_EXCEEDED, "", "Time limit exceeded", elapsedMs);
        }

        String output = readStream(process.getInputStream()).trim();
        String error = readStream(process.getErrorStream()).trim();
        int exitCode = process.exitValue();

if (exitCode != 0) {

    String lowerError = error.toLowerCase(java.util.Locale.ROOT);
    String lowerOutput = output.toLowerCase(java.util.Locale.ROOT);
    if (exitCode == 137
            || lowerError.contains("outofmemory")
            || lowerError.contains("java heap space")
            || lowerError.contains("cannot allocate memory")
            || lowerError.contains("heap out of memory")
            || lowerError.contains("allocation failed")
            || lowerError.contains("invalid string length")
            || lowerError.contains("rangeerror")
            || lowerError.contains("killed")
            || lowerOutput.contains("allocation failed")
            || lowerOutput.contains("heap out of memory")) {

        return new ExecutionResult(
                JudgeVerdict.MEMORY_LIMIT_EXCEEDED,
                "",
                "Memory limit exceeded",
                elapsedMs
        );
    }

    return new ExecutionResult(
            JudgeVerdict.RUNTIME_ERROR,
            output,
            error,
            elapsedMs
    );
}
        return new ExecutionResult(JudgeVerdict.ACCEPTED, output, "", elapsedMs);
    }

    private String readStream(InputStream inputStream) throws IOException {
        StringBuilder result = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                result.append(line).append(System.lineSeparator());
            }
        }
        return result.toString();
    }

    private void cleanupContainer(String containerName) {
        // No longer using docker containers, so no cleanup needed here.
    }

    private void deleteDirectory(Path path) {
        if (path != null) {
            deleteDirectory(path.toFile());
        }
    }

    private void deleteDirectory(File file) {
        if (file == null || !file.exists()) {
            return;
        }
        File[] files = file.listFiles();
        if (files != null) {
            for (File child : files) {
                deleteDirectory(child);
            }
        }
        file.delete();
    }
}
