package com.codearena.codearena_backend.judge;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Component
public class OutputComparator {

    private static final double FLOAT_TOLERANCE = 1e-6;

    private final ObjectMapper objectMapper;

    public OutputComparator(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public boolean matches(ProblemMetadata metadata, String actualJson, Object expected) {
        try {
            Object actual = objectMapper.readValue(actualJson, Object.class);
            Object normalizedExpected = normalizeSpecialExpected(metadata, expected);
            Object normalizedActual = normalizeSpecialActual(metadata, actual);
            return deepEquals(normalizedActual, normalizedExpected);
        } catch (Exception e) {
            return false;
        }
    }

    public String toDisplayJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            return String.valueOf(value);
        }
    }

    private Object normalizeSpecialExpected(ProblemMetadata metadata, Object expected) {
        if ("Two Sum".equals(metadata.title()) && expected instanceof List<?> list) {
            return sortedList(list);
        }
        if ("N-Queens".equals(metadata.title()) && expected instanceof List<?> list) {
            return sortedBoards(list);
        }
        return expected;
    }

    private Object normalizeSpecialActual(ProblemMetadata metadata, Object actual) {
        if ("Two Sum".equals(metadata.title()) && actual instanceof List<?> list) {
            return sortedList(list);
        }
        if ("N-Queens".equals(metadata.title()) && actual instanceof List<?> list) {
            return sortedBoards(list);
        }
        return actual;
    }

    private List<?> sortedList(List<?> list) {
        return list.stream().sorted(Comparator.comparing(String::valueOf)).toList();
    }

    private List<String> sortedBoards(List<?> boards) {
        List<String> serialized = new ArrayList<>();
        for (Object board : boards) {
            serialized.add(toDisplayJson(board));
        }
        serialized.sort(String::compareTo);
        return serialized;
    }

    @SuppressWarnings("unchecked")
    private boolean deepEquals(Object actual, Object expected) {
        if (actual == null || expected == null) {
            return actual == expected;
        }

        if (actual instanceof Number actualNumber && expected instanceof Number expectedNumber) {
            return Math.abs(actualNumber.doubleValue() - expectedNumber.doubleValue()) <= FLOAT_TOLERANCE;
        }

        if (actual instanceof List<?> actualList && expected instanceof List<?> expectedList) {
            if (actualList.size() != expectedList.size()) {
                return false;
            }
            for (int i = 0; i < actualList.size(); i++) {
                if (!deepEquals(actualList.get(i), expectedList.get(i))) {
                    return false;
                }
            }
            return true;
        }

        if (actual instanceof Map<?, ?> actualMap && expected instanceof Map<?, ?> expectedMap) {
            if (actualMap.size() != expectedMap.size()) {
                return false;
            }
            for (Object key : actualMap.keySet()) {
                if (!expectedMap.containsKey(key) || !deepEquals(actualMap.get(key), expectedMap.get(key))) {
                    return false;
                }
            }
            return true;
        }

        return actual.equals(expected);
    }
}
