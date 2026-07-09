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
                } else if (javaCode.contains("merge(")) {
                    javaCode += "\n\npublic class Main {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        java.util.List<int[]> list = new java.util.ArrayList<>();\n        while (sc.hasNextInt()) {\n            int a = sc.nextInt();\n            if (sc.hasNextInt()) {\n                int b = sc.nextInt();\n                list.add(new int[]{a, b});\n            }\n        }\n        int[][] intervals = list.toArray(new int[list.size()][]);\n        int[][] res = new Solution().merge(intervals);\n        for (int[] r : res) {\n            System.out.println(r[0] + \" \" + r[1]);\n        }\n    }\n}\n";
                } else if (javaCode.contains("isValid(")) {
                    javaCode += "\n\npublic class Main {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        if (sc.hasNextLine()) {\n            String s = sc.nextLine();\n            System.out.println(new Solution().isValid(s) ? \"true\" : \"false\");\n        }\n    }\n}\n";
                } else if (javaCode.contains("maxSubArray(")) {
                    javaCode += "\n\npublic class Main {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        java.util.List<Integer> list = new java.util.ArrayList<>();\n        while (sc.hasNextInt()) list.add(sc.nextInt());\n        int[] nums = new int[list.size()];\n        for (int i = 0; i < list.size(); i++) nums[i] = list.get(i);\n        if (nums.length > 0) System.out.println(new Solution().maxSubArray(nums));\n    }\n}\n";
                } else if (javaCode.contains("levelOrder(")) {
                    if (!javaCode.contains("class TreeNode")) {
                        javaCode = "class TreeNode { int val; TreeNode left; TreeNode right; TreeNode(int x) { val = x; } }\n" + javaCode;
                    }
                    javaCode += "\n\npublic class Main {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        java.util.List<String> parts = new java.util.ArrayList<>();\n        while (sc.hasNext()) parts.add(sc.next());\n        if (parts.isEmpty() || parts.get(0).equalsIgnoreCase(\"null\")) {\n            System.out.println(\"[]\");\n        } else {\n            java.util.List<TreeNode> nodes = new java.util.ArrayList<>();\n            for (String p : parts) nodes.add(p.equalsIgnoreCase(\"null\") ? null : new TreeNode(Integer.parseInt(p)));\n            for (int i = 0; i < nodes.size(); i++) {\n                if (nodes.get(i) != null) {\n                    int l = 2*i + 1, r = 2*i + 2;\n                    if (l < nodes.size()) nodes.get(i).left = nodes.get(l);\n                    if (r < nodes.size()) nodes.get(i).right = nodes.get(r);\n                }\n            }\n            java.util.List<java.util.List<Integer>> res = new Solution().levelOrder(nodes.isEmpty() ? null : nodes.get(0));\n            StringBuilder sb = new StringBuilder(\"[\");\n            for (int i = 0; i < res.size(); i++) {\n                sb.append(res.get(i).toString().replaceAll(\"\\\\s+\", \"\"));\n                if (i < res.size() - 1) sb.append(\",\");\n            }\n            sb.append(\"]\");\n            System.out.println(sb.toString());\n        }\n    }\n}\n";
                } else if (javaCode.contains("climbStairs(")) {
                    javaCode += "\n\npublic class Main {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            System.out.println(new Solution().climbStairs(n));\n        }\n    }\n}\n";
                } else if (javaCode.contains("findMedianSortedArrays(")) {
                    javaCode += "\n\npublic class Main {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        if (sc.hasNextLine()) {\n            String[] p1 = sc.nextLine().trim().split(\"\\\\s+\");\n            int[] n1 = p1.length == 1 && p1[0].isEmpty() ? new int[0] : new int[p1.length];\n            for (int i = 0; i < n1.length; i++) n1[i] = Integer.parseInt(p1[i]);\n            if (sc.hasNextLine()) {\n                String[] p2 = sc.nextLine().trim().split(\"\\\\s+\");\n                int[] n2 = p2.length == 1 && p2[0].isEmpty() ? new int[0] : new int[p2.length];\n                for (int i = 0; i < n2.length; i++) n2[i] = Integer.parseInt(p2[i]);\n                System.out.println(new Solution().findMedianSortedArrays(n1, n2));\n            }\n        }\n    }\n}\n";
                } else if (javaCode.contains("solveNQueens(")) {
                    javaCode += "\n\npublic class Main {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            java.util.List<java.util.List<String>> res = new Solution().solveNQueens(n);\n            for (int i = 0; i < res.size(); i++) {\n                for (String row : res.get(i)) System.out.println(row);\n                if (i < res.size() - 1) System.out.println();\n            }\n        }\n    }\n}\n";
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
            if (!pythonCode.contains("sys.stdin") && !pythonCode.contains("__main__")) {
                if (pythonCode.contains("def reverseString(")) {
                    pythonCode += "\n\nimport sys\nif __name__ == '__main__':\n    input_str = sys.stdin.read().strip()\n    if input_str:\n        s_list = list(input_str)\n        Solution().reverseString(s_list)\n        print(\"\".join(s_list))\n";
                } else if (pythonCode.contains("def twoSum(")) {
                    pythonCode += "\n\nimport sys\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    if lines and len(lines) >= 2:\n        nums = [int(x) for x in lines[0].split()]\n        target = int(lines[1])\n        res = Solution().twoSum(nums, target)\n        if res:\n            print(\" \".join(map(str, res)))\n";
                } else if (pythonCode.contains("def lengthOfLongestSubstring(")) {
                    pythonCode += "\n\nimport sys\nif __name__ == '__main__':\n    s = sys.stdin.read().strip()\n    print(Solution().lengthOfLongestSubstring(s))\n";
                } else if (pythonCode.contains("def merge(")) {
                    pythonCode += "\n\nimport sys\nif __name__ == '__main__':\n    lines = [l.strip() for l in sys.stdin.read().splitlines() if l.strip()]\n    intervals = [[int(x) for x in line.split()] for line in lines]\n    res = Solution().merge(intervals)\n    for r in res:\n        print(r[0], r[1])\n";
                } else if (pythonCode.contains("def isValid(")) {
                    pythonCode += "\n\nimport sys\nif __name__ == '__main__':\n    s = sys.stdin.read().strip()\n    print(\"true\" if Solution().isValid(s) else \"false\")\n";
                } else if (pythonCode.contains("def maxSubArray(")) {
                    pythonCode += "\n\nimport sys\nif __name__ == '__main__':\n    nums = [int(x) for x in sys.stdin.read().split()]\n    if nums:\n        print(Solution().maxSubArray(nums))\n";
                } else if (pythonCode.contains("def levelOrder(")) {
                    pythonCode += "\n\nimport sys, json\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\nif __name__ == '__main__':\n    parts = sys.stdin.read().split()\n    if not parts or parts[0].lower() == 'null':\n        print(\"[]\")\n    else:\n        nodes = [TreeNode(int(x)) if x.lower() != 'null' else None for x in parts]\n        for i in range(len(nodes)):\n            if nodes[i]:\n                l_idx, r_idx = 2*i + 1, 2*i + 2\n                if l_idx < len(nodes): nodes[i].left = nodes[l_idx]\n                if r_idx < len(nodes): nodes[i].right = nodes[r_idx]\n        res = Solution().levelOrder(nodes[0] if nodes else None)\n        print(json.dumps(res, separators=(',', ':')))\n";
                } else if (pythonCode.contains("def climbStairs(")) {
                    pythonCode += "\n\nimport sys\nif __name__ == '__main__':\n    n_str = sys.stdin.read().strip()\n    if n_str:\n        print(Solution().climbStairs(int(n_str)))\n";
                } else if (pythonCode.contains("def findMedianSortedArrays(")) {
                    pythonCode += "\n\nimport sys\nif __name__ == '__main__':\n    lines = [l.strip() for l in sys.stdin.read().splitlines() if l.strip()]\n    nums1 = [int(x) for x in lines[0].split()] if len(lines) > 0 else []\n    nums2 = [int(x) for x in lines[1].split()] if len(lines) > 1 else []\n    print(f\"{Solution().findMedianSortedArrays(nums1, nums2):.1f}\")\n";
                } else if (pythonCode.contains("def solveNQueens(")) {
                    pythonCode += "\n\nimport sys\nif __name__ == '__main__':\n    n_str = sys.stdin.read().strip()\n    if n_str:\n        res = Solution().solveNQueens(int(n_str))\n        for i, board in enumerate(res):\n            for row in board:\n                print(row)\n            if i < len(res) - 1:\n                print()\n";
                } else {
                    pythonCode += "\n\nif __name__ == '__main__':\n    print(\"Hello from Python main!\")\n";
                }
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
                } else if (cppCode.contains("merge(")) {
                    cppCode += "\n\n#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<vector<int>> intervals;\n    int a, b;\n    while (cin >> a && cin >> b) intervals.push_back({a, b});\n    vector<vector<int>> res = Solution().merge(intervals);\n    for (auto& r : res) cout << r[0] << \" \" << r[1] << endl;\n    return 0;\n}\n";
                } else if (cppCode.contains("isValid(")) {
                    cppCode += "\n\n#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s;\n    if (cin >> s) {\n        cout << (Solution().isValid(s) ? \"true\" : \"false\") << endl;\n    }\n    return 0;\n}\n";
                } else if (cppCode.contains("maxSubArray(")) {
                    cppCode += "\n\n#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<int> nums;\n    int val;\n    while (cin >> val) nums.push_back(val);\n    if (!nums.empty()) cout << Solution().maxSubArray(nums) << endl;\n    return 0;\n}\n";
                } else if (cppCode.contains("levelOrder(")) {
                    if (!cppCode.contains("struct TreeNode") && !cppCode.contains("class TreeNode")) {
                        cppCode = "struct TreeNode { int val; TreeNode *left; TreeNode *right; TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} };\n" + cppCode;
                    }
                    cppCode += "\n\n#include <iostream>\n#include <vector>\n#include <string>\n#include <queue>\nusing namespace std;\nint main() {\n    vector<string> parts;\n    string s;\n    while (cin >> s) parts.push_back(s);\n    if (parts.empty() || parts[0] == \"null\" || parts[0] == \"NULL\") {\n        cout << \"[]\" << endl;\n    } else {\n        vector<TreeNode*> nodes;\n        for (auto& p : parts) nodes.push_back((p == \"null\" || p == \"NULL\") ? nullptr : new TreeNode(stoi(p)));\n        for (int i = 0; i < nodes.size(); i++) {\n            if (nodes[i]) {\n                int l = 2*i + 1, r = 2*i + 2;\n                if (l < nodes.size()) nodes[i]->left = nodes[l];\n                if (r < nodes.size()) nodes[i]->right = nodes[r];\n            }\n        }\n        vector<vector<int>> res = Solution().levelOrder(nodes.empty() ? nullptr : nodes[0]);\n        cout << \"[\";\n        for (int i = 0; i < res.size(); i++) {\n            cout << \"[\";\n            for (int j = 0; j < res[i].size(); j++) {\n                cout << res[i][j];\n                if (j < res[i].size() - 1) cout << \",\";\n            }\n            cout << \"]\";\n            if (i < res.size() - 1) cout << \",\";\n        }\n        cout << \"]\" << endl;\n    }\n    return 0;\n}\n";
                } else if (cppCode.contains("climbStairs(")) {
                    cppCode += "\n\n#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    if (cin >> n) {\n        cout << Solution().climbStairs(n) << endl;\n    }\n    return 0;\n}\n";
                } else if (cppCode.contains("findMedianSortedArrays(")) {
                    cppCode += "\n\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <string>\nusing namespace std;\nint main() {\n    string l1, l2;\n    getline(cin, l1);\n    getline(cin, l2);\n    vector<int> n1, n2;\n    stringstream ss1(l1), ss2(l2);\n    int val;\n    while (ss1 >> val) n1.push_back(val);\n    while (ss2 >> val) n2.push_back(val);\n    cout << Solution().findMedianSortedArrays(n1, n2) << endl;\n    return 0;\n}\n";
                } else if (cppCode.contains("solveNQueens(")) {
                    cppCode += "\n\n#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<vector<string>> res = Solution().solveNQueens(n);\n        for (int i = 0; i < res.size(); i++) {\n            for (auto& row : res[i]) cout << row << endl;\n            if (i < res.size() - 1) cout << endl;\n        }\n    }\n    return 0;\n}\n";
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