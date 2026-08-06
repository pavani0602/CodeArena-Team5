package com.codearena.codearena_backend.judge;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Generates a complete, runnable source file in the target language that:
 *  1. Embeds the user's submitted code
 *  2. Instantiates test-case arguments
 *  3. Calls the user's function
 *  4. Prints the result as JSON to stdout
 *
 * All logic is driven by ProblemMetadata from the DB (functionName, parameterTypes,
 * returnType) — no per-problem-title special cases.
 */
@Component
public class DriverGenerator {

    // =========================================================================
    // Public entry point
    // =========================================================================

    public String generate(String language, String userCode, ProblemMetadata metadata, StructuredTestCase testCase) {
        String normalized = language == null ? "" : language.toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case "PYTHON"              -> generatePython(userCode, metadata, testCase);
            case "JAVA"               -> generateJava(userCode, metadata, testCase);
            case "CPP", "C++"         -> generateCpp(userCode, metadata, testCase);
            case "JAVASCRIPT", "JS"   -> generateJavaScript(userCode, metadata, testCase);
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };
    }

    // =========================================================================
    // Function name resolver — reads actual name from user code via regex
    // =========================================================================

    private String resolveFunctionName(String userCode, String lang, String defaultName) {
        if (userCode == null) return defaultName;
        Pattern p;
        if ("cpp".equals(lang)) {
            p = Pattern.compile("(?:int|void|string|double|float|bool|long|vector<[^>]+>|TreeNode\\*?|string\\[\\])\\s+([a-zA-Z_][a-zA-Z0-9_]*)\\s*\\(");
        } else if ("js".equals(lang)) {
            p = Pattern.compile("(?:(?:var|let|const)\\s+([a-zA-Z_][a-zA-Z0-9_]*)\\s*=\\s*(?:function|\\([^)]*\\)\\s*=>)|function\\s+([a-zA-Z_][a-zA-Z0-9_]*)\\s*\\()");
        } else if ("python".equals(lang)) {
            p = Pattern.compile("def\\s+([a-zA-Z_][a-zA-Z0-9_]*)\\s*\\(");
        } else {
            return defaultName;
        }
        Matcher m = p.matcher(userCode);
        while (m.find()) {
            String name = "js".equals(lang) ? (m.group(1) != null ? m.group(1) : m.group(2)) : m.group(1);
            if (name == null) continue;
            // Skip build helpers
            if (name.equals("main") || name.equals("buildTree") || name.equals("__build_tree")) continue;
            // Exact match wins immediately
            if (name.equals(defaultName)) return defaultName;
            // Return first candidate
            return name;
        }
        return defaultName;
    }

    /** True if the return type is void (in-place mutation, e.g. Reverse String) */
    private static boolean isVoidReturn(ProblemMetadata metadata) {
        return "void".equalsIgnoreCase(metadata.returnType());
    }

    // =========================================================================
    // PYTHON generator
    // =========================================================================

    private String generatePython(String userCode, ProblemMetadata metadata, StructuredTestCase testCase) {
        StringBuilder d = new StringBuilder();
        d.append("import json\n");

        // TreeNode helper
        if (metadata.parameterTypes().contains("TreeNode")) {
            d.append("""
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def __build_tree(values):
    if not values or values[0] is None:
        return None
    nodes = [None if v is None else TreeNode(v) for v in values]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root

""");
        }

        d.append(userCode).append("\n\n");
        d.append("if __name__ == '__main__':\n");

        // Arguments
        appendPythonArguments(d, metadata, testCase);

        boolean hasClass = userCode.contains("class Solution");
        String fn = resolveFunctionName(userCode, "python", metadata.functionName());
        String params = String.join(", ", metadata.parameterNames());

        if (isVoidReturn(metadata)) {
            // in-place — call then use modified first param
            String firstParam = metadata.parameterNames().get(0);
            if (hasClass) {
                d.append("    obj = Solution()\n");
                d.append("    obj.").append(fn).append("(").append(params).append(")\n");
            } else {
                d.append("    ").append(fn).append("(").append(params).append(")\n");
            }
            d.append("    result = ").append(firstParam).append("\n");
        } else {
            if (hasClass) {
                d.append("    obj = Solution()\n");
                d.append("    result = obj.").append(fn).append("(").append(params).append(")\n");
            } else {
                d.append("    result = ").append(fn).append("(").append(params).append(")\n");
            }
        }
        d.append("    print(json.dumps(result, separators=(',', ':')))\n");
        return d.toString();
    }

    private void appendPythonArguments(StringBuilder d, ProblemMetadata metadata, StructuredTestCase testCase) {
        for (int i = 0; i < metadata.parameterNames().size(); i++) {
            String name = metadata.parameterNames().get(i);
            String type = metadata.parameterTypes().get(i);
            Object value = testCase.arguments().get(i);
            if ("TreeNode".equals(type)) {
                d.append("    ").append(name).append(" = __build_tree(").append(toPythonLiteral(value)).append(")\n");
            } else {
                d.append("    ").append(name).append(" = ").append(toPythonLiteral(value)).append("\n");
            }
        }
    }

    // =========================================================================
    // JAVA generator
    // =========================================================================

    private String generateJava(String userCode, ProblemMetadata metadata, StructuredTestCase testCase) {
        // Strip imports and make class package-private so we can re-define Main
        String cleanCode = userCode
                .replace("public class Solution", "class Solution")
                .lines()
                .filter(line -> !line.trim().startsWith("import "))
                .collect(Collectors.joining("\n"));

        boolean hasClass = cleanCode.contains("class Solution");
        boolean usesTreeNode = metadata.parameterTypes().contains("TreeNode");

        StringBuilder d = new StringBuilder();
        d.append("import java.util.*;\n");

        if (usesTreeNode) {
            d.append("class TreeNode { int val; TreeNode left; TreeNode right; TreeNode(int v){this.val=v;} }\n");
        }

        if (!hasClass) {
            d.append("class Solution {\n");
        }
        d.append(cleanCode);
        if (!hasClass) d.append("\n}\n");
        d.append("\n");

        d.append("public class Main {\n");

        // TreeNode builder
        if (usesTreeNode) {
            d.append("""
    static TreeNode buildTree(Integer[] vals) {
        if (vals.length == 0 || vals[0] == null) return null;
        TreeNode[] nodes = new TreeNode[vals.length];
        for (int i = 0; i < vals.length; i++) if (vals[i] != null) nodes[i] = new TreeNode(vals[i]);
        for (int i = 0; i < vals.length; i++) if (nodes[i] != null) {
            int l = 2*i+1, r = 2*i+2;
            if (l < vals.length) nodes[i].left  = nodes[l];
            if (r < vals.length) nodes[i].right = nodes[r];
        }
        return nodes[0];
    }
""");
        }

        // JSON serializer
        d.append("""
    static String json(Object v) {
        if (v == null) return "null";
        if (v instanceof String  s) return "\\"" + s.replace("\\\\","\\\\\\\\").replace("\\"","\\\\\\"") + "\\"";
        if (v instanceof Character c) return "\\"" + c + "\\"";
        if (v instanceof Boolean || v instanceof Number) return String.valueOf(v);
        if (v instanceof char[] a) {
            StringBuilder sb = new StringBuilder("[");
            for (int i=0;i<a.length;i++){if(i>0)sb.append(",");sb.append("\\"").append(a[i]).append("\\"");}
            return sb.append("]").toString();
        }
        if (v instanceof int[] a) {
            StringBuilder sb = new StringBuilder("[");
            for (int i=0;i<a.length;i++){if(i>0)sb.append(",");sb.append(a[i]);}
            return sb.append("]").toString();
        }
        if (v instanceof int[][] a) {
            StringBuilder sb = new StringBuilder("[");
            for (int i=0;i<a.length;i++){if(i>0)sb.append(",");sb.append(json(a[i]));}
            return sb.append("]").toString();
        }
        if (v instanceof double[] a) {
            StringBuilder sb = new StringBuilder("[");
            for (int i=0;i<a.length;i++){if(i>0)sb.append(",");sb.append(a[i]);}
            return sb.append("]").toString();
        }
        if (v instanceof List<?> list) {
            StringBuilder sb = new StringBuilder("[");
            for (int i=0;i<list.size();i++){if(i>0)sb.append(",");sb.append(json(list.get(i)));}
            return sb.append("]").toString();
        }
        return "\\"" + v + "\\"";
    }
    static String quote(String v) { return "\\"" + v.replace("\\\\","\\\\\\\\").replace("\\"","\\\\\\"") + "\\""; }
""");

        d.append("    public static void main(String[] args) throws Exception {\n");
        appendJavaArguments(d, metadata, testCase);
        d.append("        Solution obj = new Solution();\n");

        if (isVoidReturn(metadata)) {
            // in-place — call, then serialize modified first param
            String firstParam = metadata.parameterNames().get(0);
            d.append("        obj.").append(metadata.functionName()).append("(")
             .append(String.join(", ", metadata.parameterNames())).append(");\n");
            d.append("        System.out.println(json(").append(firstParam).append("));\n");
        } else {
            // Use reflection to find method by name (case-insensitive), then fallback to first public method
            String argsStr = String.join(", ", metadata.parameterNames());
            d.append(String.format("""
        java.lang.reflect.Method targetMethod = null;
        String expectedName = "%s";
        for (java.lang.reflect.Method m : Solution.class.getDeclaredMethods()) {
            if (m.getName().equalsIgnoreCase(expectedName)) { targetMethod = m; break; }
        }
        if (targetMethod == null) {
            for (java.lang.reflect.Method m : Solution.class.getDeclaredMethods()) {
                if (java.lang.reflect.Modifier.isPublic(m.getModifiers()) && !m.getName().equals("main")) {
                    targetMethod = m; break;
                }
            }
        }
        if (targetMethod == null) throw new RuntimeException("No suitable method found in Solution");
        try {
            Object result = targetMethod.invoke(obj, %s);
            System.out.println(json(result));
        } catch (java.lang.reflect.InvocationTargetException e) {
            if (e.getCause() instanceof Exception ex) throw ex;
            throw new RuntimeException(e.getCause());
        }
""", metadata.functionName(), argsStr));
        }

        d.append("    }\n}\n");
        return d.toString();
    }

    private void appendJavaArguments(StringBuilder d, ProblemMetadata metadata, StructuredTestCase testCase) {
        for (int i = 0; i < metadata.parameterNames().size(); i++) {
            String name = metadata.parameterNames().get(i);
            String type = metadata.parameterTypes().get(i);
            Object value = testCase.arguments().get(i);
            d.append("        ").append(toJavaDeclaration(type, name, value)).append("\n");
        }
    }

    private String toJavaDeclaration(String type, String name, Object value) {
        return switch (type) {
            case "int"      -> "int " + name + " = " + value + ";";
            case "double"   -> "double " + name + " = " + value + ";";
            case "boolean"  -> "boolean " + name + " = " + value + ";";
            case "string"   -> "String " + name + " = " + quoteJava((String) value) + ";";
            case "char[]"   -> "char[] " + name + " = " + toJavaCharArray(value) + ";";
            case "int[]"    -> "int[] " + name + " = " + toJavaIntArray(value) + ";";
            case "int[][]"  -> "int[][] " + name + " = " + toJavaIntMatrix(value) + ";";
            case "string[]" -> "String[] " + name + " = " + toJavaStringArray(value) + ";";
            case "TreeNode" -> "TreeNode " + name + " = buildTree(" + toJavaIntegerArray(value) + ");";
            default -> throw new IllegalArgumentException("Unsupported Java type: " + type);
        };
    }

    // =========================================================================
    // C++ generator
    // =========================================================================

    private String generateCpp(String userCode, ProblemMetadata metadata, StructuredTestCase testCase) {
        String cleanCode = userCode.lines()
                .filter(line -> !line.trim().startsWith("#include"))
                .collect(Collectors.joining("\n"));

        boolean usesTreeNode = metadata.parameterTypes().contains("TreeNode");

        StringBuilder d = new StringBuilder();
        d.append("#include <bits/stdc++.h>\nusing namespace std;\n");

        if (usesTreeNode) {
            d.append("struct TreeNode { int val; TreeNode *left, *right; TreeNode(int x):val(x),left(nullptr),right(nullptr){} };\n");
        }

        d.append(cleanCode).append("\n\n");

        // JSON helpers
        d.append("""
string quoteJson(const string& s) {
    string o = "\\"";
    for (char c : s) { if (c=='\\\\') o+="\\\\\\\\"; else if(c=='"') o+="\\\\\\""; else o+=c; }
    return o + "\\"";
}
string jsonVal(int v)    { return to_string(v); }
string jsonVal(long v)   { return to_string(v); }
string jsonVal(double v) { ostringstream ss; ss<<setprecision(12)<<v; return ss.str(); }
string jsonVal(bool v)   { return v ? "true" : "false"; }
string jsonVal(const string& v) { return quoteJson(v); }
string jsonVal(char v)   { return quoteJson(string(1,v)); }
template<typename T>
string jsonVal(const vector<T>& v) {
    string o = "[";
    for (size_t i=0;i<v.size();++i) { if(i) o+=","; o+=jsonVal(v[i]); }
    return o + "]";
}
""");

        if (usesTreeNode) {
            d.append("""
TreeNode* buildTree(const vector<optional<int>>& vals) {
    if (vals.empty() || !vals[0].has_value()) return nullptr;
    vector<TreeNode*> nodes(vals.size(), nullptr);
    for (size_t i=0;i<vals.size();++i) if(vals[i].has_value()) nodes[i]=new TreeNode(vals[i].value());
    for (size_t i=0;i<vals.size();++i) if(nodes[i]) {
        size_t l=2*i+1, r=2*i+2;
        if(l<vals.size()) nodes[i]->left=nodes[l];
        if(r<vals.size()) nodes[i]->right=nodes[r];
    }
    return nodes[0];
}
""");
        }

        d.append("int main() {\n");
        appendCppArguments(d, metadata, testCase);

        boolean hasClass = userCode.contains("class Solution");
        String fn = resolveFunctionName(userCode, "cpp", metadata.functionName());
        String params = String.join(", ", metadata.parameterNames());

        if (isVoidReturn(metadata)) {
            String firstParam = metadata.parameterNames().get(0);
            if (hasClass) {
                d.append("    Solution obj;\n");
                d.append("    obj.").append(fn).append("(").append(params).append(");\n");
            } else {
                d.append("    ").append(fn).append("(").append(params).append(");\n");
            }
            d.append("    cout << jsonVal(").append(firstParam).append(") << endl;\n");
        } else {
            if (hasClass) {
                d.append("    Solution obj;\n");
                d.append("    auto result = obj.").append(fn).append("(").append(params).append(");\n");
            } else {
                d.append("    auto result = ").append(fn).append("(").append(params).append(");\n");
            }
            d.append("    cout << jsonVal(result) << endl;\n");
        }

        d.append("    return 0;\n}\n");
        return d.toString();
    }

    private void appendCppArguments(StringBuilder d, ProblemMetadata metadata, StructuredTestCase testCase) {
        for (int i = 0; i < metadata.parameterNames().size(); i++) {
            String name = metadata.parameterNames().get(i);
            String type = metadata.parameterTypes().get(i);
            Object value = testCase.arguments().get(i);
            d.append("    ").append(toCppDeclaration(type, name, value)).append("\n");
        }
    }

    private String toCppDeclaration(String type, String name, Object value) {
        return switch (type) {
            case "int"      -> "int " + name + " = " + value + ";";
            case "double"   -> "double " + name + " = " + value + ";";
            case "boolean"  -> "bool " + name + " = " + ((Boolean)value ? "true" : "false") + ";";
            case "string"   -> "string " + name + " = " + quoteCpp((String) value) + ";";
            case "char[]"   -> "vector<char> " + name + " = " + toCppCharArray(value) + ";";
            case "int[]"    -> "vector<int> " + name + " = " + toCppIntArray(value) + ";";
            case "int[][]"  -> "vector<vector<int>> " + name + " = " + toCppIntMatrix(value) + ";";
            case "string[]" -> "vector<string> " + name + " = " + toCppStringArray(value) + ";";
            case "TreeNode" -> "TreeNode* " + name + " = buildTree(" + toCppOptionalIntArray(value) + ");";
            default -> throw new IllegalArgumentException("Unsupported C++ type: " + type);
        };
    }

    // =========================================================================
    // JavaScript generator
    // =========================================================================

    private String generateJavaScript(String userCode, ProblemMetadata metadata, StructuredTestCase testCase) {
        StringBuilder d = new StringBuilder();

        // TreeNode helper
        if (metadata.parameterTypes().contains("TreeNode")) {
            d.append("""
class TreeNode {
    constructor(val) { this.val = val; this.left = null; this.right = null; }
}
function buildTree(values) {
    if (!values || !values.length || values[0] === null) return null;
    const root = new TreeNode(values[0]);
    const queue = [root];
    let i = 1;
    while (i < values.length) {
        const cur = queue.shift();
        if (values[i] !== null && values[i] !== undefined) { cur.left = new TreeNode(values[i]); queue.push(cur.left); }
        i++;
        if (i < values.length && values[i] !== null && values[i] !== undefined) { cur.right = new TreeNode(values[i]); queue.push(cur.right); }
        i++;
    }
    return root;
}
""");
        }

        d.append(userCode).append("\n\n");

        // Arguments
        for (int i = 0; i < metadata.parameterNames().size(); i++) {
            String name = metadata.parameterNames().get(i);
            String type = metadata.parameterTypes().get(i);
            Object value = testCase.arguments().get(i);
            d.append("const ").append(name).append(" = ")
             .append(toJavaScriptLiteral(value, type)).append(";\n");
        }
        d.append("\n");

        boolean hasClass = userCode.contains("class Solution");
        String fn = resolveFunctionName(userCode, "js", metadata.functionName());
        String params = String.join(", ", metadata.parameterNames());

        if (isVoidReturn(metadata)) {
            String firstParam = metadata.parameterNames().get(0);
            if (hasClass) {
                d.append("const obj = new Solution();\n");
                d.append("obj.").append(fn).append("(").append(params).append(");\n");
            } else {
                d.append(fn).append("(").append(params).append(");\n");
            }
            d.append("console.log(JSON.stringify(").append(firstParam).append("));\n");
        } else {
            if (hasClass) {
                d.append("const obj = new Solution();\n");
                d.append("const result = obj.").append(fn).append("(").append(params).append(");\n");
            } else {
                d.append("const result = ").append(fn).append("(").append(params).append(");\n");
            }
            d.append("console.log(JSON.stringify(result));\n");
        }

        return d.toString();
    }

    // =========================================================================
    // Literal serializers — Python
    // =========================================================================

    private String toPythonLiteral(Object value) {
        if (value == null) return "None";
        if (value instanceof Boolean b) return b ? "True" : "False";
        if (value instanceof String s)
            return "'" + s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n").replace("\r", "\\r") + "'";
        if (value instanceof List<?> list)
            return "[" + list.stream().map(this::toPythonLiteral).collect(Collectors.joining(",")) + "]";
        return String.valueOf(value);
    }

    // =========================================================================
    // Literal serializers — Java
    // =========================================================================

    private String toJavaIntArray(Object value) {
        return "new int[]{" + joinList(value, Object::toString) + "}";
    }

    private String toJavaIntegerArray(Object value) {
        return "new Integer[]{" + joinList(value, item -> item == null ? "null" : item.toString()) + "}";
    }

    private String toJavaCharArray(Object value) {
        return "new char[]{" + joinList(value, item -> "'" + escapeJavaChar(item.toString()) + "'") + "}";
    }

    private String toJavaStringArray(Object value) {
        return "new String[]{" + joinList(value, item -> quoteJava(item.toString())) + "}";
    }

    private String toJavaIntMatrix(Object value) {
        List<?> rows = (List<?>) value;
        return "new int[][]{" + rows.stream()
                .map(row -> "{" + joinList(row, Object::toString) + "}")
                .collect(Collectors.joining(",")) + "}";
    }

    private String quoteJava(String value) {
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r") + "\"";
    }

    private String escapeJavaChar(String value) {
        return value.replace("\\", "\\\\").replace("'", "\\'");
    }

    // =========================================================================
    // Literal serializers — C++
    // =========================================================================

    private String toCppIntArray(Object value) {
        return "{" + joinList(value, Object::toString) + "}";
    }

    private String toCppOptionalIntArray(Object value) {
        return "{" + joinList(value, item -> item == null ? "nullopt" : "optional<int>(" + item + ")") + "}";
    }

    private String toCppCharArray(Object value) {
        return "{" + joinList(value, item -> "'" + escapeCppChar(item.toString()) + "'") + "}";
    }

    private String toCppStringArray(Object value) {
        return "{" + joinList(value, item -> quoteCpp(item.toString())) + "}";
    }

    private String toCppIntMatrix(Object value) {
        List<?> rows = (List<?>) value;
        return "{" + rows.stream()
                .map(row -> "{" + joinList(row, Object::toString) + "}")
                .collect(Collectors.joining(",")) + "}";
    }

    private String quoteCpp(String value) {
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r") + "\"";
    }

    private String escapeCppChar(String value) {
        return value.replace("\\", "\\\\").replace("'", "\\'");
    }

    // =========================================================================
    // Literal serializers — JavaScript
    // =========================================================================

    private String toJavaScriptLiteral(Object value, String type) {
        if ("TreeNode".equals(type)) return "buildTree(" + toJsArray(value) + ")";
        if (value == null) return "null";
        if (value instanceof Boolean) return value.toString();
        if (value instanceof Number)  return value.toString();
        if (value instanceof String s)
            return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r") + "\"";
        if (value instanceof List<?> list)
            return "[" + list.stream().map(item -> toJavaScriptLiteral(item, "")).collect(Collectors.joining(",")) + "]";
        return String.valueOf(value);
    }

    private String toJsArray(Object value) {
        if (!(value instanceof List<?> list)) return "[]";
        return "[" + list.stream()
                .map(item -> item == null ? "null" : String.valueOf(item))
                .collect(Collectors.joining(",")) + "]";
    }

    // =========================================================================
    // Shared helpers
    // =========================================================================

    private String joinList(Object value, java.util.function.Function<Object, String> mapper) {
        return ((List<?>) value).stream().map(mapper).collect(Collectors.joining(","));
    }
}
