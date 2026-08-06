package com.codearena.codearena_backend.judge;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Parses raw test-case input/output strings into structured Java objects
 * driven entirely by the ProblemMetadata (parameterTypes, returnType).
 *
 * No per-problem title switch needed — adding a new problem to the DB
 * automatically works as long as its types are one of the supported kinds.
 */
@Component
public class TestCaseDataParser {

    public StructuredTestCase parse(ProblemMetadata metadata, String inputData, String expectedOutput) {
        List<String> paramTypes = metadata.parameterTypes();
        String returnType = metadata.returnType();

        // Special case: Reverse String is void/in-place — the input IS the output
        if ("void".equalsIgnoreCase(returnType) || "reverseString".equals(metadata.functionName())) {
            // input is the char array; expected output is same array after reversal
            List<Object> args = List.of(parseCharArray(inputData));
            Object expected = parseCharArray(nullToBlank(expectedOutput).trim().isEmpty()
                    ? inputData : expectedOutput);
            return new StructuredTestCase(args, expected);
        }

        // Split input into one line per parameter
        String[] lines = nullToBlank(inputData).split("\\R", -1);

        List<Object> args = new ArrayList<>();
        for (int i = 0; i < paramTypes.size(); i++) {
            String type = paramTypes.get(i).trim();
            String raw = i < lines.length ? lines[i] : "";
            args.add(parseValue(type, raw));
        }

        Object expected = parseValue(returnType.trim(), nullToBlank(expectedOutput).trim());
        return new StructuredTestCase(args, expected);
    }

    // -------------------------------------------------------------------------
    // Generic type dispatcher
    // -------------------------------------------------------------------------

    public Object parseValue(String type, String raw) {
        return switch (type) {
            case "int"          -> parseInt(raw);
            case "double"       -> parseDouble(raw);
            case "boolean"      -> Boolean.parseBoolean(nullToBlank(raw).trim());
            case "string"       -> unquote(nullToBlank(raw).trim());
            case "int[]"        -> parseIntArray(raw);
            case "int[][]"      -> parseIntMatrix(raw);
            case "char[]"       -> parseCharArray(raw);
            case "string[]"     -> parseStringArray(raw);
            case "string[][]"   -> parseStringMatrix(raw);
            case "double[]"     -> parseDoubleArray(raw);
            case "TreeNode"     -> parseTreeArray(raw);
            default             -> nullToBlank(raw).trim();
        };
    }

    // -------------------------------------------------------------------------
    // Primitive parsers
    // -------------------------------------------------------------------------

    private static int parseInt(String value) {
        return Integer.parseInt(nullToBlank(value).trim());
    }

    private static double parseDouble(String value) {
        return Double.parseDouble(nullToBlank(value).trim());
    }

    /** Strip surrounding quotes if present */
    private static String unquote(String value) {
        if (value.startsWith("\"") && value.endsWith("\"") && value.length() >= 2) {
            return value.substring(1, value.length() - 1);
        }
        return value;
    }

    // -------------------------------------------------------------------------
    // Array / collection parsers
    // -------------------------------------------------------------------------

    private static List<Integer> parseIntArray(String value) {
        String cleaned = nullToBlank(value)
                .replace("[", " ").replace("]", " ").replace(",", " ").trim();
        if (cleaned.isEmpty()) return List.of();
        return Arrays.stream(cleaned.split("\\s+"))
                .filter(t -> !t.isBlank())
                .map(Integer::parseInt)
                .toList();
    }

    private static List<Double> parseDoubleArray(String value) {
        String cleaned = nullToBlank(value)
                .replace("[", " ").replace("]", " ").replace(",", " ").trim();
        if (cleaned.isEmpty()) return List.of();
        return Arrays.stream(cleaned.split("\\s+"))
                .filter(t -> !t.isBlank())
                .map(Double::parseDouble)
                .toList();
    }

    private static List<String> parseCharArray(String value) {
        String cleaned = nullToBlank(value).trim();
        // Handle JSON-like ["h","e","l","l","o"] format
        if (cleaned.startsWith("[")) {
            cleaned = cleaned.replaceAll("[\\[\\]]", "").trim();
            return Arrays.stream(cleaned.split(","))
                    .map(s -> s.trim().replace("\"", "").replace("'", ""))
                    .filter(s -> !s.isBlank())
                    .toList();
        }
        // Space-separated single chars
        if (cleaned.contains(" ")) {
            return Arrays.stream(cleaned.split("\\s+"))
                    .filter(t -> !t.isBlank()).toList();
        }
        // Plain string — split into individual chars
        return cleaned.chars().mapToObj(c -> String.valueOf((char) c)).toList();
    }

    private static List<String> parseStringArray(String value) {
        String cleaned = nullToBlank(value).trim();
        if (cleaned.startsWith("[")) {
            cleaned = cleaned.substring(1, cleaned.length() - 1).trim();
        }
        if (cleaned.isEmpty()) return List.of();
        // Split on commas not inside quotes
        List<String> result = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuote = false;
        for (char c : cleaned.toCharArray()) {
            if (c == '"') { inQuote = !inQuote; continue; }
            if (c == ',' && !inQuote) {
                result.add(current.toString().trim());
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }
        if (!current.isEmpty()) result.add(current.toString().trim());
        return result;
    }

    private static List<List<Integer>> parseIntMatrix(String value) {
        String cleaned = nullToBlank(value).trim();
        if (cleaned.isEmpty()) return List.of();

        // JSON-like [[1,2],[3,4]] format
        if (cleaned.startsWith("[[")) {
            List<List<Integer>> rows = new ArrayList<>();
            String inner = cleaned.substring(1, cleaned.length() - 1);
            for (String rawRow : inner.split("(?<=]),")) {
                rows.add(parseIntArray(rawRow));
            }
            return rows;
        }
        // Line-per-row format
        List<List<Integer>> rows = new ArrayList<>();
        for (String row : cleaned.split("\\R")) {
            if (!row.isBlank()) rows.add(parseIntArray(row));
        }
        return rows;
    }

    /**
     * Parses N-Queens style output: [[".Q..","...Q","Q...","..Q."],...]
     * Each board is a list of strings.
     */
    private static List<List<String>> parseStringMatrix(String value) {
        String cleaned = nullToBlank(value).trim();
        if (cleaned.isEmpty()) return List.of();

        if (cleaned.startsWith("[[")) {
            return parseBoardsJsonLike(cleaned);
        }
        // Blank-line-separated boards
        List<List<String>> boards = new ArrayList<>();
        for (String boardText : cleaned.split("\\R\\s*\\R")) {
            List<String> board = Arrays.stream(boardText.split("\\R"))
                    .map(String::trim)
                    .filter(row -> !row.isBlank())
                    .toList();
            if (!board.isEmpty()) boards.add(board);
        }
        return boards;
    }

    private static List<List<String>> parseBoardsJsonLike(String value) {
        // Strip outer [ ]
        String inner = value.substring(1, value.length() - 1).trim();
        List<List<String>> boards = new ArrayList<>();
        // Each board is [".Q..", ...], split on ],[
        List<String> rawBoards = splitTopLevelBrackets(inner);
        for (String rawBoard : rawBoards) {
            String boardInner = rawBoard.trim();
            if (boardInner.startsWith("[")) boardInner = boardInner.substring(1, boardInner.length() - 1);
            List<String> rows = Arrays.stream(boardInner.split(","))
                    .map(r -> r.trim().replace("\"", ""))
                    .filter(r -> !r.isBlank())
                    .toList();
            boards.add(rows);
        }
        return boards;
    }

    /** Split a string like "[a,b],[c,d]" at top-level commas between bracket groups */
    private static List<String> splitTopLevelBrackets(String value) {
        List<String> result = new ArrayList<>();
        int depth = 0;
        StringBuilder current = new StringBuilder();
        for (char c : value.toCharArray()) {
            if (c == '[') depth++;
            if (c == ']') depth--;
            if (c == ',' && depth == 0) {
                result.add(current.toString().trim());
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }
        if (!current.isEmpty()) result.add(current.toString().trim());
        return result;
    }

    private static List<Object> parseTreeArray(String value) {
        String cleaned = nullToBlank(value)
                .replace("[", " ").replace("]", " ").replace(",", " ").trim();
        if (cleaned.isEmpty()) return List.of();
        List<Object> result = new ArrayList<>();
        for (String token : cleaned.split("\\s+")) {
            if (token.equalsIgnoreCase("null")) {
                result.add(null);
            } else {
                result.add(Integer.parseInt(token));
            }
        }
        return result;
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private static String nullToBlank(String value) {
        return value == null ? "" : value.replace("\\n", "\n");
    }
}
