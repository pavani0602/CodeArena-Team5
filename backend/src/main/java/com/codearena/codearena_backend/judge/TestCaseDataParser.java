package com.codearena.codearena_backend.judge;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class TestCaseDataParser {

    public StructuredTestCase parse(ProblemMetadata metadata, String inputData, String expectedOutput) {
        return switch (metadata.title()) {
            case "Two Sum" -> new StructuredTestCase(
                    List.of(parseIntArray(line(inputData, 0)), parseInt(line(inputData, 1))),
                    parseIntArray(expectedOutput)
            );
            case "Reverse String" -> new StructuredTestCase(
                    List.of(parseCharArray(inputData)),
                    parseCharArray(expectedOutput)
            );
            case "Longest Substring Without Repeating Characters" -> new StructuredTestCase(
                    List.of(nullToBlank(inputData).trim()),
                    parseInt(expectedOutput)
            );
            case "Merge Intervals" -> new StructuredTestCase(
                    List.of(parseIntMatrix(inputData)),
                    parseIntMatrix(expectedOutput)
            );
            case "Valid Parentheses" -> new StructuredTestCase(
                    List.of(nullToBlank(inputData).trim()),
                    Boolean.parseBoolean(nullToBlank(expectedOutput).trim())
            );
            case "Maximum Subarray" -> new StructuredTestCase(
                    List.of(parseIntArray(inputData)),
                    parseInt(expectedOutput)
            );
            case "Binary Tree Level Order Traversal" -> new StructuredTestCase(
                    List.of(parseTreeArray(inputData)),
                    parseIntMatrixJsonLike(expectedOutput)
            );
            case "Climbing Stairs" -> new StructuredTestCase(
                    List.of(parseInt(inputData)),
                    parseInt(expectedOutput)
            );
            case "Median of Two Sorted Arrays" -> new StructuredTestCase(
                    List.of(parseIntArray(line(inputData, 0)), parseIntArray(line(inputData, 1))),
                    Double.parseDouble(nullToBlank(expectedOutput).trim())
            );
            case "N-Queens" -> new StructuredTestCase(
                    List.of(parseInt(inputData)),
                    parseBoards(expectedOutput)
            );
            default -> throw new IllegalArgumentException("No parser for problem: " + metadata.title());
        };
    }

    private static String line(String value, int index) {
        String[] lines = nullToBlank(value).split("\\R", -1);
        return index < lines.length ? lines[index] : "";
    }

    private static int parseInt(String value) {
        return Integer.parseInt(nullToBlank(value).trim());
    }

    private static List<Integer> parseIntArray(String value) {
        String cleaned = nullToBlank(value)
                .replace("[", " ")
                .replace("]", " ")
                .replace(",", " ")
                .trim();
        if (cleaned.isEmpty()) {
            return List.of();
        }
        return Arrays.stream(cleaned.split("\\s+"))
                .filter(token -> !token.isBlank())
                .map(Integer::parseInt)
                .toList();
    }

    private static List<String> parseCharArray(String value) {
        String cleaned = nullToBlank(value).trim();
        if (cleaned.contains(" ")) {
            return Arrays.stream(cleaned.split("\\s+")).filter(token -> !token.isBlank()).toList();
        }
        return cleaned.chars().mapToObj(c -> String.valueOf((char) c)).toList();
    }

    private static List<List<Integer>> parseIntMatrix(String value) {
        String cleaned = nullToBlank(value).trim();
        if (cleaned.isEmpty()) {
            return List.of();
        }
        List<List<Integer>> rows = new ArrayList<>();
        for (String row : cleaned.split("\\R")) {
            if (!row.isBlank()) {
                rows.add(parseIntArray(row));
            }
        }
        return rows;
    }

    private static List<Object> parseTreeArray(String value) {
        String cleaned = nullToBlank(value)
                .replace("[", " ")
                .replace("]", " ")
                .replace(",", " ")
                .trim();
        if (cleaned.isEmpty()) {
            return List.of();
        }
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

    private static List<List<Integer>> parseIntMatrixJsonLike(String value) {
        String cleaned = nullToBlank(value).trim();
        if (cleaned.equals("[]") || cleaned.isEmpty()) {
            return List.of();
        }
        if (!cleaned.startsWith("[")) {
            return parseIntMatrix(cleaned);
        }
        List<List<Integer>> rows = new ArrayList<>();
        String inner = cleaned.substring(1, cleaned.length() - 1);
        for (String rawRow : inner.split("(?<=]),")) {
            rows.add(parseIntArray(rawRow));
        }
        return rows;
    }

    private static List<List<String>> parseBoards(String value) {
        String cleaned = nullToBlank(value).trim();
        if (cleaned.isEmpty()) {
            return List.of();
        }
        if (cleaned.startsWith("[[")) {
            return parseBoardsJsonLike(cleaned);
        }
        List<List<String>> boards = new ArrayList<>();
        for (String boardText : cleaned.split("\\R\\s*\\R")) {
            List<String> board = Arrays.stream(boardText.split("\\R"))
                    .map(String::trim)
                    .filter(row -> !row.isBlank())
                    .toList();
            if (!board.isEmpty()) {
                boards.add(board);
            }
        }
        return boards;
    }

    private static List<List<String>> parseBoardsJsonLike(String value) {
        String cleaned = value.replace("[[", "").replace("]]", "");
        List<List<String>> boards = new ArrayList<>();
        for (String board : cleaned.split("],\\[")) {
            List<String> rows = Arrays.stream(board.split(","))
                    .map(row -> row.replace("\"", "").trim())
                    .filter(row -> !row.isBlank())
                    .toList();
            boards.add(rows);
        }
        return boards;
    }

    private static String nullToBlank(String value) {
        return value == null ? "" : value.replace("\\n", "\n");
    }
}
