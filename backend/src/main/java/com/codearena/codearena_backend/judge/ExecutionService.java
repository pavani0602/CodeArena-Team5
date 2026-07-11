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

    private static final String GPP_PATH = "C:\\mingw64\\bin\\g++.exe";
    private static final String GPP_BIN_PATH = "C:\\mingw64\\bin";

    public ExecutionResult execute(String language, String sourceCode) {
        String normalized = language == null ? "" : language.toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case "PYTHON" -> executePython(sourceCode);
            case "JAVA" -> executeJava(sourceCode);
            case "CPP", "C++" -> executeCpp(sourceCode);
            default -> new ExecutionResult(JudgeVerdict.RUNTIME_ERROR, "", "Unsupported language: " + language, 0L);
        };
    }

    private ExecutionResult executePython(String sourceCode) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("codearena-judge-python-");
            Path sourceFile = tempDir.resolve("main.py");
            Files.writeString(sourceFile, sourceCode);

            ProcessBuilder runBuilder = new ProcessBuilder("py", "main.py");
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
            tempDir = Files.createTempDirectory("codearena-judge-java-");
            Path sourceFile = tempDir.resolve("Main.java");
            Files.writeString(sourceFile, sourceCode);

            ProcessBuilder compileBuilder = new ProcessBuilder("javac", "Main.java");
            compileBuilder.directory(tempDir.toFile());
            ExecutionResult compileResult = runProcess(compileBuilder, 10);
            if (compileResult.verdict() == JudgeVerdict.TIME_LIMIT_EXCEEDED) {
                return new ExecutionResult(JudgeVerdict.COMPILATION_ERROR, "", "Compilation timeout", compileResult.executionTimeMs());
            }
            if (!compileResult.succeeded()) {
                return new ExecutionResult(JudgeVerdict.COMPILATION_ERROR, "", compileResult.error(), compileResult.executionTimeMs());
            }

            ProcessBuilder runBuilder = new ProcessBuilder("java", "Main");
            runBuilder.directory(tempDir.toFile());
            return runProcess(runBuilder, 5);
        } catch (Exception e) {
            return new ExecutionResult(JudgeVerdict.RUNTIME_ERROR, "", e.getMessage(), 0L);
        } finally {
            deleteDirectory(tempDir);
        }
    }

    private ExecutionResult executeCpp(String sourceCode) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("codearena-judge-cpp-");
            Path sourceFile = tempDir.resolve("main.cpp");
            Files.writeString(sourceFile, sourceCode);

            String compiler = resolveCppCompiler();
            if (compiler == null) {
                return new ExecutionResult(JudgeVerdict.COMPILATION_ERROR, "", "C++ compiler not found. Install g++ or add it to PATH.", 0L);
            }

            ProcessBuilder compileBuilder = new ProcessBuilder(
                    compiler,
                    "main.cpp",
                    "-o",
                    "main.exe",
                    "-static",
                    "-static-libgcc",
                    "-static-libstdc++"
            );
            compileBuilder.directory(tempDir.toFile());
            ExecutionResult compileResult = runProcess(compileBuilder, 15);
            if (compileResult.verdict() == JudgeVerdict.TIME_LIMIT_EXCEEDED) {
                return new ExecutionResult(JudgeVerdict.COMPILATION_ERROR, "", "Compilation timeout", compileResult.executionTimeMs());
            }
            if (!compileResult.succeeded()) {
                return new ExecutionResult(JudgeVerdict.COMPILATION_ERROR, "", compileResult.error(), compileResult.executionTimeMs());
            }

            ProcessBuilder runBuilder = new ProcessBuilder(tempDir.resolve("main.exe").toString());
            runBuilder.directory(tempDir.toFile());
            String currentPath = runBuilder.environment().get("PATH");
            runBuilder.environment().put("PATH", GPP_BIN_PATH + ";" + currentPath);
            return runProcess(runBuilder, 5);
        } catch (Exception e) {
            return new ExecutionResult(JudgeVerdict.RUNTIME_ERROR, "", e.getMessage(), 0L);
        } finally {
            deleteDirectory(tempDir);
        }
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
        if (process.exitValue() != 0) {
            return new ExecutionResult(JudgeVerdict.RUNTIME_ERROR, output, error, elapsedMs);
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
}
