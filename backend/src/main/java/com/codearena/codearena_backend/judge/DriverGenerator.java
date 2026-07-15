package com.codearena.codearena_backend.judge;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Component
public class DriverGenerator {

    public String generate(String language, String userCode, ProblemMetadata metadata, StructuredTestCase testCase) {
        String normalized = language == null ? "" : language.toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case "PYTHON" -> generatePython(userCode, metadata, testCase);
            case "JAVA" -> generateJava(userCode, metadata, testCase);
            case "CPP", "C++" -> generateCpp(userCode, metadata, testCase);
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };
    }

    private String generatePython(String userCode, ProblemMetadata metadata, StructuredTestCase testCase) {
        StringBuilder driver = new StringBuilder();
        driver.append("import json\n");
        if (metadata.parameterTypes().contains("TreeNode")) {
            driver.append("""
                    class TreeNode:
                        def __init__(self, val=0, left=None, right=None):
                            self.val = val
                            self.left = left
                            self.right = right

                    def __build_tree(values):
                        if not values or values[0] is None:
                            return None
                        nodes = [None if value is None else TreeNode(value) for value in values]
                        kids = nodes[::-1]
                        root = kids.pop()
                        for node in nodes:
                            if node:
                                if kids:
                                    node.left = kids.pop()
                                if kids:
                                    node.right = kids.pop()
                        return root

                    """);
        }
        driver.append(userCode).append("\n\n");
        driver.append("if __name__ == '__main__':\n");
        appendPythonArguments(driver, metadata, testCase);
        driver.append("    obj = Solution()\n");
        if ("Reverse String".equals(metadata.title())) {
            driver.append("    obj.reverseString(s)\n");
            driver.append("    result = s\n");
        } else {
            driver.append("    result = obj.")
                    .append(metadata.functionName())
                    .append("(")
                    .append(String.join(", ", metadata.parameterNames()))
                    .append(")\n");
        }
        driver.append("    print(json.dumps(result, separators=(',', ':')))\n");
        return driver.toString();
    }

    private void appendPythonArguments(StringBuilder driver, ProblemMetadata metadata, StructuredTestCase testCase) {
        for (int i = 0; i < metadata.parameterNames().size(); i++) {
            String name = metadata.parameterNames().get(i);
            String type = metadata.parameterTypes().get(i);
            Object value = testCase.arguments().get(i);
            if ("TreeNode".equals(type)) {
                driver.append("    ").append(name).append(" = __build_tree(").append(toPythonLiteral(value)).append(")\n");
            } else {
                driver.append("    ").append(name).append(" = ").append(toPythonLiteral(value)).append("\n");
            }
        }
    }

    private String generateJava(String userCode, ProblemMetadata metadata, StructuredTestCase testCase) {
        String cleanUserCode = userCode
                .replace("public class Solution", "class Solution")
                .lines()
                .filter(line -> !line.trim().startsWith("import "))
                .collect(Collectors.joining("\n"));

        StringBuilder driver = new StringBuilder();
        driver.append("import java.util.*;\n");
        boolean usesTreeNode = metadata.parameterTypes().contains("TreeNode");
        if (usesTreeNode) {
            driver.append("class TreeNode { int val; TreeNode left; TreeNode right; TreeNode(int val) { this.val = val; } }\n");
        }
        driver.append(cleanUserCode).append("\n\n");
        driver.append("public class Main {\n");
        if (usesTreeNode) {
            driver.append("""
                    static TreeNode buildTree(Integer[] values) {
                        if (values.length == 0 || values[0] == null) return null;
                        TreeNode[] nodes = new TreeNode[values.length];
                        for (int i = 0; i < values.length; i++) {
                            if (values[i] != null) nodes[i] = new TreeNode(values[i]);
                        }
                        for (int i = 0; i < values.length; i++) {
                            if (nodes[i] != null) {
                                int left = 2 * i + 1;
                                int right = 2 * i + 2;
                                if (left < values.length) nodes[i].left = nodes[left];
                                if (right < values.length) nodes[i].right = nodes[right];
                            }
                        }
                        return nodes[0];
                    }
                """);
        }
        driver.append("""
                    static String json(Object value) {
                        if (value == null) return "null";
                        if (value instanceof String s) return quote(s);
                        if (value instanceof Character c) return quote(String.valueOf(c));
                        if (value instanceof Number || value instanceof Boolean) return String.valueOf(value);
                        if (value instanceof char[] arr) {
                            StringBuilder sb = new StringBuilder("[");
                            for (int i = 0; i < arr.length; i++) {
                                if (i > 0) sb.append(",");
                                sb.append(quote(String.valueOf(arr[i])));
                            }
                            return sb.append("]").toString();
                        }
                        if (value instanceof int[] arr) {
                            StringBuilder sb = new StringBuilder("[");
                            for (int i = 0; i < arr.length; i++) {
                                if (i > 0) sb.append(",");
                                sb.append(arr[i]);
                            }
                            return sb.append("]").toString();
                        }
                        if (value instanceof int[][] arr) {
                            StringBuilder sb = new StringBuilder("[");
                            for (int i = 0; i < arr.length; i++) {
                                if (i > 0) sb.append(",");
                                sb.append(json(arr[i]));
                            }
                            return sb.append("]").toString();
                        }
                        if (value instanceof List<?> list) {
                            StringBuilder sb = new StringBuilder("[");
                            for (int i = 0; i < list.size(); i++) {
                                if (i > 0) sb.append(",");
                                sb.append(json(list.get(i)));
                            }
                            return sb.append("]").toString();
                        }
                        return quote(String.valueOf(value));
                    }
                """);
        driver.append("    static String quote(String value) {\n");
        driver.append("        return \"\\\"\" + value.replace(\"\\\\\", \"\\\\\\\\\").replace(\"\\\"\", \"\\\\\\\"\") + \"\\\"\";\n");
        driver.append("    }\n");
        driver.append("""
                    public static void main(String[] args) {
                """);
        appendJavaArguments(driver, metadata, testCase);
        driver.append("        Solution obj = new Solution();\n");
        if ("Reverse String".equals(metadata.title())) {
            driver.append("        obj.reverseString(s);\n");
            driver.append("        Object result = s;\n");
        } else {
            driver.append("        Object result = obj.")
                    .append(metadata.functionName())
                    .append("(")
                    .append(String.join(", ", metadata.parameterNames()))
                    .append(");\n");
        }
        driver.append("""
                        System.out.println(json(result));
                    }
                }
                """);
        return driver.toString();
    }

    private void appendJavaArguments(StringBuilder driver, ProblemMetadata metadata, StructuredTestCase testCase) {
        for (int i = 0; i < metadata.parameterNames().size(); i++) {
            String name = metadata.parameterNames().get(i);
            String type = metadata.parameterTypes().get(i);
            Object value = testCase.arguments().get(i);
            driver.append("        ").append(toJavaDeclaration(type, name, value)).append("\n");
        }
    }

    private String toJavaDeclaration(String type, String name, Object value) {
        return switch (type) {
            case "int" -> "int " + name + " = " + value + ";";
            case "string" -> "String " + name + " = " + quoteJava((String) value) + ";";
            case "char[]" -> "char[] " + name + " = " + toJavaCharArray(value) + ";";
            case "int[]" -> "int[] " + name + " = " + toJavaIntArray(value) + ";";
            case "int[][]" -> "int[][] " + name + " = " + toJavaIntMatrix(value) + ";";
            case "TreeNode" -> "TreeNode " + name + " = buildTree(" + toJavaIntegerArray(value) + ");";
            default -> throw new IllegalArgumentException("Unsupported Java parameter type: " + type);
        };
    }

    private String generateCpp(String userCode, ProblemMetadata metadata, StructuredTestCase testCase) {
        String cleanUserCode = userCode
                .lines()
                .filter(line -> !line.trim().startsWith("#include"))
                .collect(Collectors.joining("\n"));
        StringBuilder driver = new StringBuilder();
        driver.append("#include <bits/stdc++.h>\nusing namespace std;\n");
        boolean usesTreeNode = metadata.parameterTypes().contains("TreeNode");
        if (usesTreeNode) {
            driver.append("struct TreeNode { int val; TreeNode *left; TreeNode *right; TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} };\n");
        }
        driver.append(cleanUserCode).append("\n\n");
        driver.append("""
                string quoteJson(const string& value) {
                    string out = "\\"";
                    for (char c : value) {
                        if (c == '\\\\') out += "\\\\\\\\";
                        else if (c == '"') out += "\\\\\\"";
                        else out += c;
                    }
                    out += "\\"";
                    return out;
                }
                string jsonValue(int value) { return to_string(value); }
                string jsonValue(double value) {
                    ostringstream out;
                    out << setprecision(12) << value;
                    return out.str();
                }
                string jsonValue(bool value) { return value ? "true" : "false"; }
                string jsonValue(const string& value) { return quoteJson(value); }
                string jsonValue(char value) { return quoteJson(string(1, value)); }
                template <typename T>
                string jsonValue(const vector<T>& values) {
                    string out = "[";
                    for (size_t i = 0; i < values.size(); ++i) {
                        if (i) out += ",";
                        out += jsonValue(values[i]);
                    }
                    out += "]";
                    return out;
                }
                """);
        if (usesTreeNode) {
            driver.append("""
                TreeNode* buildTree(const vector<optional<int>>& values) {
                    if (values.empty() || !values[0].has_value()) return nullptr;
                    vector<TreeNode*> nodes(values.size(), nullptr);
                    for (size_t i = 0; i < values.size(); ++i) {
                        if (values[i].has_value()) nodes[i] = new TreeNode(values[i].value());
                    }
                    for (size_t i = 0; i < values.size(); ++i) {
                        if (nodes[i]) {
                            size_t left = 2 * i + 1;
                            size_t right = 2 * i + 2;
                            if (left < values.size()) nodes[i]->left = nodes[left];
                            if (right < values.size()) nodes[i]->right = nodes[right];
                        }
                    }
                    return nodes[0];
                }
                """);
        }
        driver.append("""
                int main() {
                """);
        appendCppArguments(driver, metadata, testCase);
        driver.append("    Solution obj;\n");
        if ("Reverse String".equals(metadata.title())) {
            driver.append("    obj.reverseString(s);\n");
            driver.append("    auto result = s;\n");
        } else {
            driver.append("    auto result = obj.")
                    .append(metadata.functionName())
                    .append("(")
                    .append(String.join(", ", metadata.parameterNames()))
                    .append(");\n");
        }
        driver.append("""
                    cout << jsonValue(result) << endl;
                    return 0;
                }
                """);
        return driver.toString();
    }

    private void appendCppArguments(StringBuilder driver, ProblemMetadata metadata, StructuredTestCase testCase) {
        for (int i = 0; i < metadata.parameterNames().size(); i++) {
            String name = metadata.parameterNames().get(i);
            String type = metadata.parameterTypes().get(i);
            Object value = testCase.arguments().get(i);
            driver.append("    ").append(toCppDeclaration(type, name, value)).append("\n");
        }
    }

    private String toCppDeclaration(String type, String name, Object value) {
        return switch (type) {
            case "int" -> "int " + name + " = " + value + ";";
            case "string" -> "string " + name + " = " + quoteCpp((String) value) + ";";
            case "char[]" -> "vector<char> " + name + " = " + toCppCharArray(value) + ";";
            case "int[]" -> "vector<int> " + name + " = " + toCppIntArray(value) + ";";
            case "int[][]" -> "vector<vector<int>> " + name + " = " + toCppIntMatrix(value) + ";";
            case "TreeNode" -> "TreeNode* " + name + " = buildTree(" + toCppOptionalIntArray(value) + ");";
            default -> throw new IllegalArgumentException("Unsupported C++ parameter type: " + type);
        };
    }

    private String toPythonLiteral(Object value) {
        if (value == null) return "None";
        if (value instanceof String s) return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'";
        if (value instanceof List<?> list) {
            return "[" + list.stream().map(this::toPythonLiteral).collect(Collectors.joining(",")) + "]";
        }
        return String.valueOf(value);
    }

    private String toJavaIntArray(Object value) {
        return "new int[]{" + joinList(value, Object::toString) + "};";
    }

    private String toJavaIntegerArray(Object value) {
        return "new Integer[]{" + joinList(value, item -> item == null ? "null" : item.toString()) + "}";
    }

    private String toJavaCharArray(Object value) {
        return "new char[]{" + joinList(value, item -> "'" + escapeJavaChar(item.toString()) + "'") + "};";
    }

    private String toJavaIntMatrix(Object value) {
        List<?> rows = (List<?>) value;
        return "new int[][]{" + rows.stream()
                .map(row -> "{" + joinList(row, Object::toString) + "}")
                .collect(Collectors.joining(",")) + "};";
    }

    private String toCppIntArray(Object value) {
        return "{" + joinList(value, Object::toString) + "};";
    }

    private String toCppOptionalIntArray(Object value) {
        return "{" + joinList(value, item -> item == null ? "nullopt" : "optional<int>(" + item + ")") + "}";
    }

    private String toCppCharArray(Object value) {
        return "{" + joinList(value, item -> "'" + escapeCppChar(item.toString()) + "'") + "};";
    }

    private String toCppIntMatrix(Object value) {
        List<?> rows = (List<?>) value;
        return "{" + rows.stream()
                .map(row -> "{" + joinList(row, Object::toString) + "}")
                .collect(Collectors.joining(",")) + "};";
    }

    private String quoteJava(String value) {
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }

    private String quoteCpp(String value) {
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }

    private String escapeJavaChar(String value) {
        return value.replace("\\", "\\\\").replace("'", "\\'");
    }

    private String escapeCppChar(String value) {
        return value.replace("\\", "\\\\").replace("'", "\\'");
    }

    private String joinList(Object value, java.util.function.Function<Object, String> mapper) {
        return ((List<?>) value).stream().map(mapper).collect(Collectors.joining(","));
    }
}
