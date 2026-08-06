package com.codearena.codearena_backend.judge;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("DriverGenerator Exhaustive Unit Tests")
class DriverGeneratorTest {

    private DriverGenerator driverGenerator;

    @BeforeEach
    void setUp() {
        driverGenerator = new DriverGenerator();
    }

    @Nested
    @DisplayName("Python Code Generation")
    class PythonTests {

        @Test
        @DisplayName("Python - Standalone Function & Valid Syntax")
        void generatePython_StandaloneFunction() {
            ProblemMetadata metadata = new ProblemMetadata(
                    "Two Sum", "FUNCTION", "Solution", "twoSum",
                    List.of("nums", "target"),
                    List.of("int[]", "int"),
                    "int[]"
            );
            StructuredTestCase testCase = new StructuredTestCase(
                    List.of(List.of(2, 7, 11, 15), 9),
                    List.of(0, 1)
            );
            String userCode = "def twoSum(nums, target):\n    return [0, 1]";

            String generated = driverGenerator.generate("PYTHON", userCode, metadata, testCase);

            assertNotNull(generated);
            assertTrue(generated.contains("import json"), "Python driver must import json module");
            assertTrue(generated.contains("nums = [2,7,11,15]"), "Python driver must construct nums list literal");
            assertTrue(generated.contains("target = 9"), "Python driver must construct target int literal");
            assertTrue(generated.contains("result = twoSum(nums, target)"), "Python driver must invoke standalone function");
            assertTrue(generated.contains("print(json.dumps(result, separators=(',', ':')))"), "Python driver must serialize output to json");
            assertFalse(generated.contains("class TreeNode:"), "Python driver must not include TreeNode class when not requested");
        }

        @Test
        @DisplayName("Python - Solution Class Method")
        void generatePython_SolutionClass() {
            ProblemMetadata metadata = new ProblemMetadata(
                    "Two Sum", "FUNCTION", "Solution", "twoSum",
                    List.of("nums", "target"),
                    List.of("int[]", "int"),
                    "int[]"
            );
            StructuredTestCase testCase = new StructuredTestCase(
                    List.of(List.of(2, 7), 9),
                    List.of(0, 1)
            );
            String userCode = "class Solution:\n    def twoSum(self, nums, target):\n        return [0, 1]";

            String generated = driverGenerator.generate("PYTHON", userCode, metadata, testCase);

            assertTrue(generated.contains("obj = Solution()"), "Python driver must instantiate Solution class");
            assertTrue(generated.contains("result = obj.twoSum(nums, target)"), "Python driver must invoke obj.twoSum");
        }

        @Test
        @DisplayName("Python - TreeNode Parameter Support")
        void generatePython_TreeNodeFeature() {
            ProblemMetadata metadata = new ProblemMetadata(
                    "Binary Tree Level Order Traversal", "FUNCTION", "Solution", "levelOrder",
                    List.of("root"),
                    List.of("TreeNode"),
                    "int[][]"
            );
            StructuredTestCase testCase = new StructuredTestCase(
                    List.of(Arrays.asList(3, 9, 20, null, null, 15, 7)),
                    List.of(List.of(3), List.of(9, 20), List.of(15, 7))
            );
            String userCode = "def levelOrder(root):\n    return [[3], [9, 20], [15, 7]]";

            String generated = driverGenerator.generate("PYTHON", userCode, metadata, testCase);

            assertTrue(generated.contains("class TreeNode:"), "Python driver must declare TreeNode class");
            assertTrue(generated.contains("def __build_tree(values):"), "Python driver must include __build_tree helper function");
            assertTrue(generated.contains("root = __build_tree([3,9,20,None,None,15,7])"), "Python driver must convert nulls to None for __build_tree");
        }
    }

    @Nested
    @DisplayName("Java Code Generation")
    class JavaTests {

        @Test
        @DisplayName("Java - Various Parameter Types (int, string, char[], int[], int[][])")
        void generateJava_VariousTypes() {
            ProblemMetadata metadata = new ProblemMetadata(
                    "Complex Problem", "FUNCTION", "Solution", "solve",
                    List.of("a", "b", "c", "d", "e"),
                    List.of("int", "string", "char[]", "int[]", "int[][]"),
                    "int"
            );
            StructuredTestCase testCase = new StructuredTestCase(
                    List.of(42, "hello", List.of('x', 'y'), List.of(1, 2, 3), List.of(List.of(1, 2), List.of(3, 4))),
                    42
            );
            String userCode = "public int solve(int a, String b, char[] c, int[] d, int[][] e) { return a; }";

            String generated = driverGenerator.generate("JAVA", userCode, metadata, testCase);

            assertTrue(generated.contains("int a = 42;"), "Java driver must declare int parameter");
            assertTrue(generated.contains("String b = \"hello\";"), "Java driver must declare String parameter");
            assertTrue(generated.contains("char[] c = new char[]{'x','y'};"), "Java driver must declare char[] parameter");
            assertTrue(generated.contains("int[] d = new int[]{1,2,3};"), "Java driver must declare int[] parameter");
            assertTrue(generated.contains("int[][] e = new int[][]{{1,2},{3,4}};"), "Java driver must declare int[][] parameter");
            assertTrue(generated.contains("public class Main"), "Java driver must contain public class Main entry point");
            assertTrue(generated.contains("Solution obj = new Solution();"), "Java driver must instantiate Solution");
        }

        @Test
        @DisplayName("Java - TreeNode Parameter Support")
        void generateJava_TreeNodeFeature() {
            ProblemMetadata metadata = new ProblemMetadata(
                    "Invert Binary Tree", "FUNCTION", "Solution", "invertTree",
                    List.of("root"),
                    List.of("TreeNode"),
                    "TreeNode"
            );
            StructuredTestCase testCase = new StructuredTestCase(
                    List.of(List.of(4, 2, 7, 1, 3, 6, 9)),
                    List.of(4, 7, 2, 9, 6, 3, 1)
            );
            String userCode = "public TreeNode invertTree(TreeNode root) { return root; }";

            String generated = driverGenerator.generate("JAVA", userCode, metadata, testCase);

            assertTrue(generated.contains("class TreeNode { int val; TreeNode left; TreeNode right; TreeNode(int val) { this.val = val; } }"),
                    "Java driver must declare class TreeNode");
            assertTrue(generated.contains("static TreeNode buildTree(Integer[] values)"),
                    "Java driver must contain buildTree helper method");
            assertTrue(generated.contains("TreeNode root = buildTree(new Integer[]{4,2,7,1,3,6,9});"),
                    "Java driver must build tree from Integer array");
        }
    }

    @Nested
    @DisplayName("C++ Code Generation")
    class CppTests {

        @Test
        @DisplayName("C++ - Standard Generation & Include Filtering")
        void generateCpp_BasicFunction() {
            ProblemMetadata metadata = new ProblemMetadata(
                    "Two Sum", "FUNCTION", "Solution", "twoSum",
                    List.of("nums", "target"),
                    List.of("int[]", "int"),
                    "int[]"
            );
            StructuredTestCase testCase = new StructuredTestCase(
                    List.of(List.of(2, 7, 11, 15), 9),
                    List.of(0, 1)
            );
            String userCode = "#include <iostream>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) { return {0, 1}; }";

            String generated = driverGenerator.generate("CPP", userCode, metadata, testCase);

            assertFalse(generated.contains("#include <iostream>"), "C++ driver must filter user #include directives to prevent duplicates");
            assertTrue(generated.contains("#include <bits/stdc++.h>"), "C++ driver must include bits/stdc++.h");
            assertTrue(generated.contains("vector<int> nums = {2,7,11,15};"), "C++ driver must declare vector<int> parameter");
            assertTrue(generated.contains("int target = 9;"), "C++ driver must declare int target parameter");
            assertTrue(generated.contains("auto result = twoSum(nums, target);"), "C++ driver must invoke twoSum function");
            assertTrue(generated.contains("cout << jsonValue(result) << endl;"), "C++ driver must print jsonValue output");
        }

        @Test
        @DisplayName("C++ - TreeNode Parameter Support")
        void generateCpp_TreeNodeFeature() {
            ProblemMetadata metadata = new ProblemMetadata(
                    "Tree Depth", "FUNCTION", "Solution", "maxDepth",
                    List.of("root"),
                    List.of("TreeNode"),
                    "int"
            );
            StructuredTestCase testCase = new StructuredTestCase(
                    List.of(Arrays.asList(3, 9, 20, null, null, 15, 7)),
                    3
            );
            String userCode = "int maxDepth(TreeNode* root) { return 3; }";

            String generated = driverGenerator.generate("C++", userCode, metadata, testCase);

            assertTrue(generated.contains("struct TreeNode { int val; TreeNode *left; TreeNode *right;"),
                    "C++ driver must define TreeNode struct");
            assertTrue(generated.contains("TreeNode* buildTree(const vector<optional<int>>& values)"),
                    "C++ driver must define buildTree helper function taking optional<int>");
            assertTrue(generated.contains("TreeNode* root = buildTree({optional<int>(3),optional<int>(9),optional<int>(20),nullopt,nullopt,optional<int>(15),optional<int>(7)});"),
                    "C++ driver must instantiate buildTree with optional ints and nullopt");
        }
    }

    @Nested
    @DisplayName("JavaScript Code Generation (including new JS TreeNode Feature)")
    class JavaScriptTests {

        @Test
        @DisplayName("JavaScript - Standalone Function Generation")
        void generateJavaScript_BasicFunction() {
            ProblemMetadata metadata = new ProblemMetadata(
                    "Two Sum", "FUNCTION", "Solution", "twoSum",
                    List.of("nums", "target"),
                    List.of("int[]", "int"),
                    "int[]"
            );
            StructuredTestCase testCase = new StructuredTestCase(
                    List.of(List.of(2, 7, 11, 15), 9),
                    List.of(0, 1)
            );
            String userCode = "function twoSum(nums, target) {\n    return [0, 1];\n}";

            String generated = driverGenerator.generate("JAVASCRIPT", userCode, metadata, testCase);

            assertTrue(generated.contains("const nums = [2,7,11,15];"), "JS driver must output const nums array literal");
            assertTrue(generated.contains("const target = 9;"), "JS driver must output const target literal");
            assertTrue(generated.contains("const result = twoSum(nums, target);"), "JS driver must call standalone function");
            assertTrue(generated.contains("console.log(JSON.stringify(result));"), "JS driver must log JSON.stringify(result)");
            assertFalse(generated.contains("class TreeNode"), "JS driver must not include TreeNode class when not requested");
        }

        @Test
        @DisplayName("JavaScript - New JS TreeNode Feature Validation")
        void generateJavaScript_TreeNodeFeature() {
            ProblemMetadata metadata = new ProblemMetadata(
                    "Binary Tree Level Order Traversal", "FUNCTION", "Solution", "levelOrder",
                    List.of("root"),
                    List.of("TreeNode"),
                    "int[][]"
            );
            StructuredTestCase testCase = new StructuredTestCase(
                    List.of(Arrays.asList(3, 9, 20, null, null, 15, 7)),
                    List.of(List.of(3), List.of(9, 20), List.of(15, 7))
            );
            String userCode = """
                    class Solution {
                        levelOrder(root) {
                            if (!root) return [];
                            return [[3], [9, 20], [15, 7]];
                        }
                    }
                    """;

            String generated = driverGenerator.generate("JS", userCode, metadata, testCase);

            // Assert exact JS TreeNode class structure
            assertTrue(generated.contains("class TreeNode {"), "Must contain JS TreeNode class definition");
            assertTrue(generated.contains("constructor(val) {"), "Must contain TreeNode constructor");
            assertTrue(generated.contains("this.val = val;"), "Must set val in JS TreeNode constructor");
            assertTrue(generated.contains("this.left = null;"), "Must initialize left child to null in JS TreeNode");
            assertTrue(generated.contains("this.right = null;"), "Must initialize right child to null in JS TreeNode");

            // Assert buildTree helper function structure
            assertTrue(generated.contains("function buildTree(values) {"), "Must contain buildTree helper function");
            assertTrue(generated.contains("let queue = [root];"), "Must use queue for BFS tree building in JS");

            // Assert parameter argument initialization with buildTree
            assertTrue(generated.contains("const root = buildTree([3,9,20,null,null,15,7]);"), "Must convert array to TreeNode using buildTree in JS");

            // Assert Solution class instantiation and function invocation
            assertTrue(generated.contains("const obj = new Solution();"), "Must instantiate Solution class in JS");
            assertTrue(generated.contains("const result = obj.levelOrder(root);"), "Must invoke obj.levelOrder(root)");
            assertTrue(generated.contains("console.log(JSON.stringify(result));"), "Must output JSON stringified result");
        }
    }

    @Nested
    @DisplayName("Language Aliases, Casing, and Unsupported Language Validation")
    class ValidationTests {

        @ParameterizedTest
        @ValueSource(strings = {"PYTHON", "python", "PyThOn", "JAVA", "Java", "CPP", "C++", "c++", "JAVASCRIPT", "javascript", "js", "JS"})
        @DisplayName("Should accept valid language strings with any casing or alias")
        void generate_LanguageAliasesAndCasing(String language) {
            ProblemMetadata metadata = new ProblemMetadata(
                    "Two Sum", "FUNCTION", "Solution", "twoSum",
                    List.of("nums", "target"),
                    List.of("int[]", "int"),
                    "int[]"
            );
            StructuredTestCase testCase = new StructuredTestCase(
                    List.of(List.of(2, 7), 9),
                    List.of(0, 1)
            );
            String userCode = "// Dummy user code";

            assertDoesNotThrow(() -> driverGenerator.generate(language, userCode, metadata, testCase));
        }

        @Test
        @DisplayName("Should throw IllegalArgumentException for unsupported language")
        void generate_UnsupportedLanguage_ThrowsException() {
            ProblemMetadata metadata = new ProblemMetadata(
                    "Two Sum", "FUNCTION", "Solution", "twoSum",
                    List.of("nums"), List.of("int[]"), "int[]"
            );
            StructuredTestCase testCase = new StructuredTestCase(List.of(List.of(1)), List.of(1));

            IllegalArgumentException ex = assertThrows(
                    IllegalArgumentException.class,
                    () -> driverGenerator.generate("RUBY", "def two_sum; end", metadata, testCase)
            );
            assertTrue(ex.getMessage().contains("Unsupported language: RUBY"));
        }
    }
}
