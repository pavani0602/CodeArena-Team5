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

            String javaCode = code.replace("public class Solution", "class Solution");
            if (!javaCode.contains("class Main") && !javaCode.contains("void main(")) {
                if (javaCode.contains("reverseString(")) {
                    javaCode += "\n\npublic class Main {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        if (sc.hasNextLine()) {\n            String line = sc.nextLine();\n            char[] arr = line.toCharArray();\n            new Solution().reverseString(arr);\n            System.out.println(new String(arr));\n        }\n    }\n}\n";
                } else if (javaCode.contains("twoSum(")) {
                    javaCode += "\n\npublic class Main {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        if (sc.hasNextLine()) {\n            String[] parts = sc.nextLine().trim().split(\"\\\\s+\");\n            int[] nums = new int[parts.length];\n            for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n            if (sc.hasNextInt()) {\n                int target = sc.nextInt();\n                int[] res = new Solution().twoSum(nums, target);\n                if (res != null && res.length >= 2) System.out.println(res[0] + \" \" + res[1]);\n            }\n        }\n    }\n}\n";
                } else if (javaCode.contains("lengthOfLongestSubstring(")) {
                    javaCode += "\n\npublic class Main {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        if (sc.hasNextLine()) {\n            String s = sc.nextLine();\n            System.out.println(new Solution().lengthOfLongestSubstring(s));\n        }\n    }\n}\n";
                } else if (javaCode.contains("isValid(")) {
                    javaCode += "\n\npublic class Main {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        if (sc.hasNextLine()) {\n            String s = sc.nextLine();\n            System.out.println(new Solution().isValid(s) ? \"true\" : \"false\");\n        }\n    }\n}\n";
                } else if (javaCode.contains("climbStairs(")) {
                    javaCode += "\n\npublic class Main {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            System.out.println(new Solution().climbStairs(n));\n        }\n    }\n}\n";
                } else {
                    javaCode += "\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello from Main!\");\n    }\n}\n";
                }
            }

            Path javaFile = tempDir.resolve("Main.java");
            Files.writeString(javaFile, javaCode);

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

            String cppCode = code;
            if (!cppCode.contains("int main(") && !cppCode.contains("void main(")) {
                if (cppCode.contains("reverseString(")) {
                    cppCode += "\n\n#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\nint main() {\n    string input_str;\n    if (cin >> input_str) {\n        vector<char> s(input_str.begin(), input_str.end());\n        Solution().reverseString(s);\n        for (char c : s) cout << c;\n        cout << endl;\n    }\n    return 0;\n}\n";
                } else if (cppCode.contains("twoSum(")) {
                    cppCode += "\n\n#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<int> nums;\n    int val;\n    for (int i = 0; i < 4; i++) {\n        if (cin >> val) nums.push_back(val);\n    }\n    int target;\n    if (cin >> target) {\n        vector<int> res = Solution().twoSum(nums, target);\n        if (res.size() >= 2) cout << res[0] << \" \" << res[1] << endl;\n    }\n    return 0;\n}\n";
                } else if (cppCode.contains("lengthOfLongestSubstring(")) {
                    cppCode += "\n\n#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s;\n    if (cin >> s) {\n        cout << Solution().lengthOfLongestSubstring(s) << endl;\n    }\n    return 0;\n}\n";
                } else if (cppCode.contains("isValid(")) {
                    cppCode += "\n\n#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s;\n    if (cin >> s) {\n        cout << (Solution().isValid(s) ? \"true\" : \"false\") << endl;\n    }\n    return 0;\n}\n";
                } else if (cppCode.contains("climbStairs(")) {
                    cppCode += "\n\n#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    if (cin >> n) {\n        cout << Solution().climbStairs(n) << endl;\n    }\n    return 0;\n}\n";
                } else {
                    cppCode += "\n\n#include <iostream>\nusing namespace std;\nint main() {\n    cout << \"Hello from C++ main!\" << endl;\n    return 0;\n}\n";
                }
            }

            Path cppFile = tempDir.resolve("main.cpp");
            Files.writeString(cppFile, cppCode);

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