package com.codearena.codearena_backend.judge;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

@Service
public class ExecutionService {

    

    public ExecutionResult execute(String language, String sourceCode) {

    if (containsDangerousCode(sourceCode)) {
        return new ExecutionResult(
                JudgeVerdict.RUNTIME_ERROR,
                "",
                "Restricted API usage detected.",
                0L
        );
    }

    String normalized = language == null ? "" : language.toUpperCase(Locale.ROOT);

    return switch (normalized) {
        case "PYTHON" -> executePython(sourceCode);
        case "JAVA" -> executeJava(sourceCode);
        case "CPP", "C++" -> executeCpp(sourceCode);
        default -> new ExecutionResult(
                JudgeVerdict.RUNTIME_ERROR,
                "",
                "Unsupported language: " + language,
                0L
        );
    };
}

    private Path createJudgeTempDirectory(String prefix) throws IOException {
        Path baseDir = Path.of(System.getProperty("user.dir"), "target", "temp-judge");
        if (!Files.exists(baseDir)) {
            Files.createDirectories(baseDir);
        }
        return Files.createTempDirectory(baseDir, prefix);
    }

    private ExecutionResult executePython(String sourceCode) {
        Path tempDir = null;
        try {
            tempDir = createJudgeTempDirectory("codearena-judge-python-");
            Path sourceFile = tempDir.resolve("main.py");
            Files.writeString(sourceFile, sourceCode);

            ProcessBuilder runBuilder = new ProcessBuilder(
    "docker",
    "run",
    "--rm",
    "--memory=512m",
    "--cpus=1",
    "-v",
    tempDir.toAbsolutePath() + ":/app",
    "-w",
    "/app",
    "python:3.11",
    "python",
    "main.py"
);

runBuilder.directory(tempDir.toFile());
            return runProcess(runBuilder, 5);
        } catch (Exception e) {
            return new ExecutionResult(JudgeVerdict.RUNTIME_ERROR, "", e.getMessage(), 0L);
        } finally {
            deleteDirectory(tempDir);
        }
    }

    private ExecutionResult executeJava(String sourceCode) {
        Path tempDir = null;
        try {
            tempDir = createJudgeTempDirectory("codearena-judge-java-");
            Path sourceFile = tempDir.resolve("Main.java");
            Files.writeString(sourceFile, sourceCode);
ProcessBuilder compileBuilder = new ProcessBuilder(
    "docker",
    "run",
    "--rm",
    "--memory=512m",
    "--cpus=1",
    "-v",
    tempDir.toAbsolutePath() + ":/app",
    "-w",
    "/app",
    "eclipse-temurin:17",
    "javac",
    "Main.java"
);
compileBuilder.directory(tempDir.toFile());
            
            
            ExecutionResult compileResult = runProcess(compileBuilder, 10);
            if (compileResult.verdict() == JudgeVerdict.TIME_LIMIT_EXCEEDED) {
                return new ExecutionResult(JudgeVerdict.COMPILATION_ERROR, "", "Compilation timeout", compileResult.executionTimeMs());
            }
            if (!compileResult.succeeded()) {
                return new ExecutionResult(JudgeVerdict.COMPILATION_ERROR, "", compileResult.error(), compileResult.executionTimeMs());
            }

            ProcessBuilder runBuilder = new ProcessBuilder(
    "docker",
    "run",
    "--rm",
    "--memory=512m",
    "--cpus=1",
    "-i",
    "-v",
    tempDir.toAbsolutePath() + ":/app",
    "-w",
    "/app",
    "eclipse-temurin:17",
    "java",
    "Main"
);
runBuilder.directory(tempDir.toFile());
            return runProcess(runBuilder, 5);
        } catch (Exception e) {
            return new ExecutionResult(JudgeVerdict.RUNTIME_ERROR, "", e.getMessage(), 0L);
        } finally {
            deleteDirectory(tempDir);
        }
    }

    private ExecutionResult executeCpp(String sourceCode) {
        try {
            long startedAt = System.nanoTime();
            String jsonPayload = String.format(
                "{\"compiler\": \"gcc-head\", \"code\": \"%s\", \"save\": false}",
                sourceCode.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r")
            );

            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://wandbox.org/api/compile.json"))
                    .header("Content-Type", "application/json")
                    .POST(java.net.http.HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());
            long elapsedMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startedAt);

            if (response.statusCode() != 200) {
                return new ExecutionResult(JudgeVerdict.RUNTIME_ERROR, "", "Wandbox API failed with status: " + response.statusCode(), elapsedMs);
            }

            String body = response.body();
            // Basic JSON parsing to extract fields without adding Jackson dependencies
            String status = extractJsonString(body, "status");
            String programOutput = extractJsonString(body, "program_output");
            String programError = extractJsonString(body, "program_error");
            String compilerError = extractJsonString(body, "compiler_error");

            if (compilerError != null && !compilerError.isBlank()) {
                return new ExecutionResult(JudgeVerdict.COMPILATION_ERROR, "", compilerError.trim(), elapsedMs);
            }

            if (!"0".equals(status)) {
                return new ExecutionResult(JudgeVerdict.RUNTIME_ERROR, programOutput != null ? programOutput.trim() : "", programError != null ? programError.trim() : "", elapsedMs);
            }

            return new ExecutionResult(JudgeVerdict.ACCEPTED, programOutput != null ? programOutput.trim() : "", "", elapsedMs);
        } catch (Exception e) {
            return new ExecutionResult(JudgeVerdict.RUNTIME_ERROR, "", e.getMessage(), 0L);
        }
    }

    private String extractJsonString(String json, String key) {
        String searchKey = "\"" + key + "\":";
        int index = json.indexOf(searchKey);
        if (index == -1) return null;
        int startIndex = json.indexOf("\"", index + searchKey.length());
        if (startIndex == -1) return null;
        
        // Handle values that might not be strings (e.g. "status": "0" is usually a string in Wandbox, but just in case)
        int endIndex = startIndex + 1;
        boolean escape = false;
        while (endIndex < json.length()) {
            char c = json.charAt(endIndex);
            if (escape) {
                escape = false;
            } else if (c == '\\') {
                escape = true;
            } else if (c == '"') {
                break;
            }
            endIndex++;
        }
        
        if (endIndex >= json.length()) return null;
        
        String extracted = json.substring(startIndex + 1, endIndex);
        return extracted.replace("\\n", "\n").replace("\\r", "\r").replace("\\\"", "\"").replace("\\\\", "\\");
    }

    private String resolveCppCompiler() {
        if (Files.exists(Path.of(GPP_PATH))) {
            return GPP_PATH;
        }
        return isCommandAvailable("g++") ? "g++" : null;
    }

    private boolean isCommandAvailable(String command) {
        try {
            Process process = new ProcessBuilder(command, "--version").start();
            boolean finished = process.waitFor(3, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return false;
            }
            return process.exitValue() == 0;
        } catch (Exception e) {
            return false;
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

    if (exitCode == 137
            || error.contains("OutOfMemoryError")
            || error.contains("Java heap space")
            || error.contains("Cannot allocate memory")
            || error.contains("Killed")) {

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
    private boolean containsDangerousCode(String code) {

    String lower = code.toLowerCase();

    return lower.contains("runtime.getruntime().exec")
        || lower.contains("processbuilder")
        || lower.contains("system.exit")
        || lower.contains("java.io")
        || lower.contains("java.net")
        || lower.contains("socket")
        || lower.contains("file");
}
}
