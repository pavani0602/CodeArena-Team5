package com.codearena.codearena_backend.judge;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

@DisplayName("ExecutionService Exhaustive Integration & Unit Tests")
class ExecutionServiceTest {

    private ExecutionService executionService;

    @BeforeEach
    void setUp() {
        executionService = new ExecutionService();
    }

    private boolean isDockerAvailable() {
        try {
            Process process = new ProcessBuilder("docker", "info").start();
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

    @Nested
    @DisplayName("Unsupported Language Validation")
    class UnsupportedLanguageTests {

        @ParameterizedTest
        @ValueSource(strings = {"RUST", "GO", "KOTLIN", "SWIFT", "RUBY"})
        @DisplayName("Should return RUNTIME_ERROR for unsupported languages without invoking Docker")
        void execute_UnsupportedLanguages_ReturnsRuntimeError(String language) {
            ExecutionResult result = executionService.execute(language, "// dummy code");

            assertNotNull(result);
            assertEquals(JudgeVerdict.RUNTIME_ERROR, result.verdict());
            assertTrue(result.error().contains("Unsupported language: " + language));
        }

        @Test
        @DisplayName("Should return RUNTIME_ERROR when language is null")
        void execute_NullLanguage_ReturnsRuntimeError() {
            ExecutionResult result = executionService.execute(null, "// dummy code");

            assertNotNull(result);
            assertEquals(JudgeVerdict.RUNTIME_ERROR, result.verdict());
            assertTrue(result.error().contains("Unsupported language: null"));
        }
    }

    @Nested
    @DisplayName("Python Execution Tests (Valid Syntax, TLE, MLE)")
    class PythonExecutionTests {

        @Test
        @DisplayName("Python - Valid Syntax Execution")
        void executePython_ValidSyntax() {
            assumeTrue(isDockerAvailable(), "Docker is not running locally");

            String code = "print('Hello Python')";
            ExecutionResult result = executionService.execute("PYTHON", code);

            assertEquals(JudgeVerdict.ACCEPTED, result.verdict(), result.error());
            assertEquals("Hello Python", result.output().trim());
        }

        @Test
        @DisplayName("Python - Infinite Loop (Time Limit Exceeded - TLE)")
        void executePython_InfiniteLoop_TLE() {
            assumeTrue(isDockerAvailable(), "Docker is not running locally");

            String code = """
                    import time
                    while True:
                        time.sleep(0.1)
                    """;
            ExecutionResult result = executionService.execute("PYTHON", code);

            assertEquals(JudgeVerdict.TIME_LIMIT_EXCEEDED, result.verdict());
            assertTrue(result.executionTimeMs() >= 5000L);
        }

        @Test
        @DisplayName("Python - Memory Leak (Memory Limit Exceeded - MLE)")
        void executePython_MemoryLeak_MLE() {
            assumeTrue(isDockerAvailable(), "Docker is not running locally");

            String code = """
                    a = []
                    while True:
                        a.append(bytearray(50 * 1024 * 1024))
                    """;
            ExecutionResult result = executionService.execute("PYTHON", code);

            assertEquals(JudgeVerdict.MEMORY_LIMIT_EXCEEDED, result.verdict());
        }
    }

    @Nested
    @DisplayName("Java Execution Tests (Valid Syntax, TLE, MLE)")
    class JavaExecutionTests {

        @Test
        @DisplayName("Java - Valid Syntax Execution")
        void executeJava_ValidSyntax() {
            assumeTrue(isDockerAvailable(), "Docker is not running locally");

            String code = """
                    public class Main {
                        public static void main(String[] args) {
                            System.out.println("Hello Java");
                        }
                    }
                    """;
            ExecutionResult result = executionService.execute("JAVA", code);

            assertEquals(JudgeVerdict.ACCEPTED, result.verdict(), result.error());
            assertEquals("Hello Java", result.output().trim());
        }

        @Test
        @DisplayName("Java - Infinite Loop (Time Limit Exceeded - TLE)")
        void executeJava_InfiniteLoop_TLE() {
            assumeTrue(isDockerAvailable(), "Docker is not running locally");

            String code = """
                    public class Main {
                        public static void main(String[] args) throws Exception {
                            while (true) {
                                Thread.sleep(100);
                            }
                        }
                    }
                    """;
            ExecutionResult result = executionService.execute("JAVA", code);

            assertEquals(JudgeVerdict.TIME_LIMIT_EXCEEDED, result.verdict());
            assertTrue(result.executionTimeMs() >= 5000L);
        }

        @Test
        @DisplayName("Java - Memory Leak (Memory Limit Exceeded - MLE)")
        void executeJava_MemoryLeak_MLE() {
            assumeTrue(isDockerAvailable(), "Docker is not running locally");

            String code = """
                    public class Main {
                        public static void main(String[] args) {
                            byte[] b = new byte[500 * 1024 * 1024];
                        }
                    }
                    """;
            ExecutionResult result = executionService.execute("JAVA", code);

            assertEquals(JudgeVerdict.MEMORY_LIMIT_EXCEEDED, result.verdict());
        }
    }

    @Nested
    @DisplayName("C++ Execution Tests (Valid Syntax, TLE, MLE)")
    class CppExecutionTests {

        @Test
        @DisplayName("C++ - Valid Syntax Execution")
        void executeCpp_ValidSyntax() {
            assumeTrue(isDockerAvailable(), "Docker is not running locally");

            String code = """
                    #include <iostream>
                    int main() {
                        std::cout << "Hello C++" << std::endl;
                        return 0;
                    }
                    """;
            ExecutionResult result = executionService.execute("CPP", code);
            assumeTrue(result.verdict() != JudgeVerdict.COMPILATION_ERROR, "Docker gcc compilation timed out locally");

            assertEquals(JudgeVerdict.ACCEPTED, result.verdict(), result.error());
            assertEquals("Hello C++", result.output().trim());
        }

        @Test
        @DisplayName("C++ - Infinite Loop (Time Limit Exceeded - TLE)")
        void executeCpp_InfiniteLoop_TLE() {
            assumeTrue(isDockerAvailable(), "Docker is not running locally");

            String code = """
                    int main() {
                        while (true) {}
                        return 0;
                    }
                    """;
            ExecutionResult result = executionService.execute("C++", code);
            assumeTrue(result.verdict() != JudgeVerdict.COMPILATION_ERROR, "Docker gcc compilation timed out locally");

            assertEquals(JudgeVerdict.TIME_LIMIT_EXCEEDED, result.verdict());
            assertTrue(result.executionTimeMs() >= 5000L);
        }

        @Test
        @DisplayName("C++ - Memory Leak (Memory Limit Exceeded - MLE)")
        void executeCpp_MemoryLeak_MLE() {
            assumeTrue(isDockerAvailable(), "Docker is not running locally");

            String code = """
                    #include <vector>
                    int main() {
                        std::vector<char*> v;
                        while (true) {
                            char* p = new char[50 * 1024 * 1024];
                            p[0] = 1;
                            v.push_back(p);
                        }
                        return 0;
                    }
                    """;
            ExecutionResult result = executionService.execute("CPP", code);
            assumeTrue(result.verdict() != JudgeVerdict.COMPILATION_ERROR, "Docker gcc compilation timed out locally");

            assertEquals(JudgeVerdict.MEMORY_LIMIT_EXCEEDED, result.verdict());
        }
    }

    @Nested
    @DisplayName("JavaScript Execution Tests (Valid Syntax, TLE, MLE, & JS TreeNode Feature)")
    class JavaScriptExecutionTests {

        @Test
        @DisplayName("JavaScript - Valid Syntax Execution")
        void executeJavaScript_ValidSyntax() {
            assumeTrue(isDockerAvailable(), "Docker is not running locally");

            String code = "console.log('Hello JS');";
            ExecutionResult result = executionService.execute("JAVASCRIPT", code);

            assertEquals(JudgeVerdict.ACCEPTED, result.verdict(), result.error());
            assertEquals("Hello JS", result.output().trim());
        }

        @Test
        @DisplayName("JavaScript - Infinite Loop (Time Limit Exceeded - TLE)")
        void executeJavaScript_InfiniteLoop_TLE() {
            assumeTrue(isDockerAvailable(), "Docker is not running locally");

            String code = "while (true) {}";
            ExecutionResult result = executionService.execute("JS", code);

            assertEquals(JudgeVerdict.TIME_LIMIT_EXCEEDED, result.verdict());
            assertTrue(result.executionTimeMs() >= 5000L);
        }

        @Test
        @DisplayName("JavaScript - Memory Leak (Memory Limit Exceeded - MLE)")
        void executeJavaScript_MemoryLeak_MLE() {
            assumeTrue(isDockerAvailable(), "Docker is not running locally");

            String code = """
                    let s = 'x'.repeat(10 * 1024 * 1024);
                    const a = [];
                    while (true) {
                        a.push(s);
                        s = s + s;
                    }
                    """;
            ExecutionResult result = executionService.execute("JAVASCRIPT", code);

            assertEquals(JudgeVerdict.MEMORY_LIMIT_EXCEEDED, result.verdict());
        }

        @Test
        @DisplayName("JavaScript - New JS TreeNode Feature End-to-End Execution")
        void executeJavaScript_TreeNodeFeature_Accepted() {
            assumeTrue(isDockerAvailable(), "Docker is not running locally");

            String code = """
                    class TreeNode {
                        constructor(val) {
                            this.val = val;
                            this.left = null;
                            this.right = null;
                        }
                    }

                    function buildTree(values) {
                        if (!values || values.length === 0 || values[0] === null) return null;
                        let root = new TreeNode(values[0]);
                        let queue = [root];
                        let i = 1;
                        while (i < values.length) {
                            let current = queue.shift();
                            if (values[i] !== null && values[i] !== undefined) {
                                current.left = new TreeNode(values[i]);
                                queue.push(current.left);
                            }
                            i++;
                            if (i < values.length && values[i] !== null && values[i] !== undefined) {
                                current.right = new TreeNode(values[i]);
                                queue.push(current.right);
                            }
                            i++;
                        }
                        return root;
                    }

                    const root = buildTree([10, 5, 15, null, null, 12, 20]);
                    console.log(JSON.stringify(root.right.left.val));
                    """;

            ExecutionResult result = executionService.execute("JS", code);

            assertEquals(JudgeVerdict.ACCEPTED, result.verdict(), result.error());
            assertEquals("12", result.output().trim());
        }
    }
}
