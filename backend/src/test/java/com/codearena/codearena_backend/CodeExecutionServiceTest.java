package com.codearena.codearena_backend;

import com.codearena.codearena_backend.dto.CodeExecutionRequest;
import com.codearena.codearena_backend.dto.CodeExecutionResponse;
import com.codearena.codearena_backend.service.CodeExecutionService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class CodeExecutionServiceTest {

    private final CodeExecutionService service = new CodeExecutionService();

    @Test
    void testJavaCodeExecution() {

        CodeExecutionRequest request = new CodeExecutionRequest();

        request.setLanguage("JAVA");

        request.setCode("""
                public class Main {
                    public static void main(String[] args) {
                        System.out.print("Hello Docker");
                    }
                }
                """);

        request.setInput("");

        CodeExecutionResponse response = service.executeCode(request);

        System.out.println("Status : " + response.getStatus());
        System.out.println("Error  : " + response.getError());
        System.out.println("Output : " + response.getOutput());

        assertEquals("SUCCESS", response.getStatus());
        assertEquals("Hello Docker", response.getOutput().trim());
    }

    @Test
    void testInfiniteLoopTimeout() {

        CodeExecutionRequest request = new CodeExecutionRequest();

        request.setLanguage("JAVA");

        request.setCode("""
                public class Main {
                    public static void main(String[] args) {
                        while (true) {

                        }
                    }
                }
                """);

        request.setInput("");

        CodeExecutionResponse response = service.executeCode(request);

        System.out.println("Status : " + response.getStatus());
        System.out.println("Error  : " + response.getError());
        System.out.println("Output : " + response.getOutput());

        assertEquals("TIME_LIMIT_EXCEEDED", response.getStatus());
        assertEquals("Time limit exceeded", response.getError());
        assertEquals("", response.getOutput());
    }

    @Test
    void testOutOfMemory() {

        CodeExecutionRequest request = new CodeExecutionRequest();

        request.setLanguage("JAVA");

        request.setCode("""
                import java.util.*;

                public class Main {
                    public static void main(String[] args) {
                        List<byte[]> list = new ArrayList<>();

                        while (true) {
                            list.add(new byte[1024 * 1024]);
                        }
                    }
                }
                """);

        request.setInput("");

        CodeExecutionResponse response = service.executeCode(request);

        System.out.println("Status : " + response.getStatus());
        System.out.println("Error  : " + response.getError());
        System.out.println("Output : " + response.getOutput());

        assertEquals("MEMORY_LIMIT_EXCEEDED", response.getStatus());
    }

    @Test
    void testMaliciousSystemCall() {

        CodeExecutionRequest request = new CodeExecutionRequest();

        request.setLanguage("JAVA");

        request.setCode("""
                import java.io.*;

                public class Main {

                    public static void main(String[] args) {

                        try {

                            Process process = Runtime.getRuntime().exec("cat /etc/passwd");

                            BufferedReader reader = new BufferedReader(
                                    new InputStreamReader(process.getInputStream()));

                            String line;

                            while ((line = reader.readLine()) != null) {
                                System.out.println(line);
                            }

                            process.waitFor();

                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
                """);

        request.setInput("");

        CodeExecutionResponse response = service.executeCode(request);

        System.out.println("Status : " + response.getStatus());
        System.out.println("Error  : " + response.getError());
        System.out.println("Output : " + response.getOutput());

        // Container isolation should prevent or fail this system call.
        request.setCode("""
        import java.io.*;

        public class Main {
            public static void main(String[] args) {
                try {
                    Process process =
                            Runtime.getRuntime().exec("cat /host/etc/passwd");

                    BufferedReader reader =
                            new BufferedReader(
                                    new InputStreamReader(process.getInputStream()));

                    String line;

                    while ((line = reader.readLine()) != null) {
                        System.out.println(line);
                    }

                    process.waitFor();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        """);
    }
}