package com.codearena.codearena_backend.judge;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
public class ProblemMetadataService {

    private final Map<String, ProblemMetadata> metadataByTitle = Map.ofEntries(
            entry("Two Sum", "twoSum", List.of("nums", "target"), List.of("int[]", "int"), "int[]"),
            entry("Reverse String", "reverseString", List.of("s"), List.of("char[]"), "char[]"),
            entry("Longest Substring Without Repeating Characters", "lengthOfLongestSubstring", List.of("s"), List.of("string"), "int"),
            entry("Merge Intervals", "merge", List.of("intervals"), List.of("int[][]"), "int[][]"),
            entry("Valid Parentheses", "isValid", List.of("s"), List.of("string"), "boolean"),
            entry("Maximum Subarray", "maxSubArray", List.of("nums"), List.of("int[]"), "int"),
            entry("Binary Tree Level Order Traversal", "levelOrder", List.of("root"), List.of("TreeNode"), "int[][]"),
            entry("Climbing Stairs", "climbStairs", List.of("n"), List.of("int"), "int"),
            entry("Median of Two Sorted Arrays", "findMedianSortedArrays", List.of("nums1", "nums2"), List.of("int[]", "int[]"), "double"),
            entry("N-Queens", "solveNQueens", List.of("n"), List.of("int"), "string[][]")
    );

    public Optional<ProblemMetadata> findByTitle(String title) {
        if (title == null) {
            return Optional.empty();
        }
        ProblemMetadata metadata = metadataByTitle.get(normalize(title));
        if (metadata != null) {
            return Optional.of(metadata);
        }
        return Optional.of(new ProblemMetadata(
                title,
                "FUNCTION",
                "Solution",
                "solve",
                List.of("input"),
                List.of("string"),
                "string"
        ));
    }

    private static Map.Entry<String, ProblemMetadata> entry(
            String title,
            String functionName,
            List<String> parameterNames,
            List<String> parameterTypes,
            String returnType
    ) {
        return Map.entry(
                normalize(title),
                new ProblemMetadata(title, "FUNCTION", "Solution", functionName, parameterNames, parameterTypes, returnType)
        );
    }

    private static String normalize(String title) {
        return title.trim().toLowerCase(Locale.ROOT);
    }
}
