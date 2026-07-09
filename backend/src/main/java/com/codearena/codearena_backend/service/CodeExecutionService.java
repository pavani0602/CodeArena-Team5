package com.codearena.codearena_backend.service;

import com.codearena.codearena_backend.dto.CodeExecutionRequest;
import com.codearena.codearena_backend.dto.CodeExecutionResponse;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

@Service
public class CodeExecutionService {

    private static final String GPP_PATH =
            "C:\\mingw64\\bin\\g++.exe";

    private static final String GPP_BIN_PATH =
            "C:\\mingw64\\bin";

    public CodeExecutionResponse executeCode(CodeExecutionRequest request) {

        if (request.getLanguage() == null || request.getLanguage().isBlank()) {
            return new CodeExecutionResponse("", "Language is required", "ERROR");
        }

        if (request.getCode() == null || request.getCode().isBlank()) {
            return new CodeExecutionResponse("", "Code is required", "ERROR");
        }

        String language = request.getLanguage().toUpperCase();

        if (language.equals("JAVA")) {
            return executeJava(request.getCode(), request.getInput());
        }

        if (language.equals("PYTHON")) {
            return executePython(request.getCode(), request.getInput());
        }

        if (language.equals("CPP") || language.equals("C++")) {
            return executeCpp(request.getCode(), request.getInput());
        }

        return new CodeExecutionResponse(
                "",
                "Unsupported language: " + request.getLanguage(),
                "ERROR"
        );
    }

    private CodeExecutionResponse executeJava(String code, String input) {
        Path tempDir = null;

        try {
            tempDir = Files.createTempDirectory("codearena-java-");

            Path javaFile = tempDir.resolve("Main.java");
            Files.writeString(javaFile, code);

            ProcessBuilder compileBuilder = new ProcessBuilder("javac", "Main.java");
            compileBuilder.directory(tempDir.toFile());

            Process compileProcess = compileBuilder.start();

            boolean compileFinished = compileProcess.waitFor(10, TimeUnit.SECONDS);

            if (!compileFinished) {
                compileProcess.destroyForcibly();
                return new CodeExecutionResponse("", "Compilation timeout", "COMPILATION_ERROR");
            }

            String compileError = readStream(compileProcess.getErrorStream());

            if (compileProcess.exitValue() != 0) {
                return new CodeExecutionResponse("", compileError, "COMPILATION_ERROR");
            }

            ProcessBuilder runBuilder = new ProcessBuilder("java", "Main");
            runBuilder.directory(tempDir.toFile());

            Process runProcess = runBuilder.start();

            writeInput(runProcess, input);

            boolean runFinished = runProcess.waitFor(5, TimeUnit.SECONDS);

            if (!runFinished) {
                runProcess.destroyForcibly();
                return new CodeExecutionResponse("", "Time limit exceeded", "TIME_LIMIT_EXCEEDED");
            }

            String output = readStream(runProcess.getInputStream());
            String error = readStream(runProcess.getErrorStream());

            if (runProcess.exitValue() != 0) {
                return new CodeExecutionResponse(output, error, "RUNTIME_ERROR");
            }

            return new CodeExecutionResponse(output.trim(), "", "SUCCESS");

        } catch (Exception e) {
            return new CodeExecutionResponse("", e.getMessage(), "ERROR");
        } finally {
            if (tempDir != null) {
                deleteDirectory(tempDir.toFile());
            }
        }
    }

    private CodeExecutionResponse executePython(String code, String input) {
        Path tempDir = null;

        try {
            tempDir = Files.createTempDirectory("codearena-python-");

            String pythonCode = code;
            if (pythonCode.contains("def reverseString(") && !pythonCode.contains("sys.stdin") && !pythonCode.contains("__main__")) {
                pythonCode += "\n\nimport sys\nif __name__ == '__main__':\n    input_str = sys.stdin.read().strip()\n    if input_str:\n        s_list = list(input_str)\n        Solution().reverseString(s_list)\n        print(\"\".join(s_list))\n";
            } else if (pythonCode.contains("def twoSum(") && !pythonCode.contains("sys.stdin") && !pythonCode.contains("__main__")) {
                pythonCode += "\n\nimport sys\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    if lines and len(lines) >= 2:\n        nums = [int(x) for x in lines[0].split()]\n        target = int(lines[1])\n        res = Solution().twoSum(nums, target)\n        if res:\n            print(\" \".join(map(str, res)))\n";
            } else if (pythonCode.contains("def lengthOfLongestSubstring(") && !pythonCode.contains("sys.stdin") && !pythonCode.contains("__main__")) {
                pythonCode += "\n\nimport sys\nif __name__ == '__main__':\n    s = sys.stdin.read().strip()\n    print(Solution().lengthOfLongestSubstring(s))\n";
            } else if (pythonCode.contains("def isValid(") && !pythonCode.contains("sys.stdin") && !pythonCode.contains("__main__")) {
                pythonCode += "\n\nimport sys\nif __name__ == '__main__':\n    s = sys.stdin.read().strip()\n    print(\"true\" if Solution().isValid(s) else \"false\")\n";
            } else if (pythonCode.contains("def climbStairs(") && !pythonCode.contains("sys.stdin") && !pythonCode.contains("__main__")) {
                pythonCode += "\n\nimport sys\nif __name__ == '__main__':\n    n_str = sys.stdin.read().strip()\n    if n_str:\n        print(Solution().climbStairs(int(n_str)))\n";
            }

            Path pythonFile = tempDir.resolve("main.py");
            Files.writeString(pythonFile, pythonCode);

            ProcessBuilder runBuilder = new ProcessBuilder("py", "main.py");
            runBuilder.directory(tempDir.toFile());

            Process runProcess = runBuilder.start();

            writeInput(runProcess, input);

            boolean runFinished = runProcess.waitFor(5, TimeUnit.SECONDS);

            if (!runFinished) {
                runProcess.destroyForcibly();
                return new CodeExecutionResponse("", "Time limit exceeded", "TIME_LIMIT_EXCEEDED");
            }

            String output = readStream(runProcess.getInputStream());
            String error = readStream(runProcess.getErrorStream());

            if (runProcess.exitValue() != 0) {
                return new CodeExecutionResponse(output, error, "RUNTIME_ERROR");
            }

            return new CodeExecutionResponse(output.trim(), "", "SUCCESS");

        } catch (Exception e) {
            return new CodeExecutionResponse("", e.getMessage(), "ERROR");
        } finally {
            if (tempDir != null) {
                deleteDirectory(tempDir.toFile());
            }
        }
    }

    private CodeExecutionResponse executeCpp(String code, String input) {
        Path tempDir = null;

        try {
            tempDir = Files.createTempDirectory("codearena-cpp-");

            Path cppFile = tempDir.resolve("main.cpp");
            Files.writeString(cppFile, code);

            ProcessBuilder compileBuilder = new ProcessBuilder(
                    GPP_PATH,
                    "main.cpp",
                    "-o",
                    "main.exe",
                    "-static",
                    "-static-libgcc",
                    "-static-libstdc++"
            );
            compileBuilder.directory(tempDir.toFile());

            Process compileProcess = compileBuilder.start();

            boolean compileFinished = compileProcess.waitFor(15, TimeUnit.SECONDS);

            if (!compileFinished) {
                compileProcess.destroyForcibly();
                return new CodeExecutionResponse("", "Compilation timeout", "COMPILATION_ERROR");
            }

            String compileError = readStream(compileProcess.getErrorStream());

            if (compileProcess.exitValue() != 0) {
                return new CodeExecutionResponse("", compileError, "COMPILATION_ERROR");
            }

            ProcessBuilder runBuilder = new ProcessBuilder(
                    tempDir.resolve("main.exe").toString()
            );
            runBuilder.directory(tempDir.toFile());

            String currentPath = runBuilder.environment().get("PATH");
            runBuilder.environment().put(
                    "PATH",
                    GPP_BIN_PATH + ";" + currentPath
            );

            Process runProcess = runBuilder.start();

            writeInput(runProcess, input);

            boolean runFinished = runProcess.waitFor(5, TimeUnit.SECONDS);

            if (!runFinished) {
                runProcess.destroyForcibly();
                return new CodeExecutionResponse("", "Time limit exceeded", "TIME_LIMIT_EXCEEDED");
            }

            String output = readStream(runProcess.getInputStream());
            String error = readStream(runProcess.getErrorStream());

            if (runProcess.exitValue() != 0) {
                return new CodeExecutionResponse(output, error, "RUNTIME_ERROR");
            }

            return new CodeExecutionResponse(output.trim(), "", "SUCCESS");

        } catch (Exception e) {
            return new CodeExecutionResponse("", e.getMessage(), "ERROR");
        } finally {
            if (tempDir != null) {
                deleteDirectory(tempDir.toFile());
            }
        }
    }

    private void writeInput(Process process, String input) throws IOException {
        if (input != null && !input.isBlank()) {
            try (BufferedWriter writer = new BufferedWriter(
                    new OutputStreamWriter(process.getOutputStream())
            )) {
                writer.write(input);
                writer.flush();
            }
        } else {
            process.getOutputStream().close();
        }
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