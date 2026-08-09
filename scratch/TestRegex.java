import java.util.regex.*;

public class TestRegex {
    public static void main(String[] args) {
        String cppCode1 = "class Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n    }\n};";
        String cppCode2 = "std::vector<int> twoSum(std::vector<int>& nums, int target) { return {}; }";
        String jsCode1 = "var solve = function(nums, target) { return []; };";
        String jsCode2 = "function twoSum(nums, target) { return []; }";
        String pyCode1 = "class Solution(object):\n    def solve(self, nums, target):\n        pass";
        String pyCode2 = "def twoSum(nums, target):\n    pass";

        System.out.println("CPP1: " + extractFuncName(cppCode1, "cpp"));
        System.out.println("CPP2: " + extractFuncName(cppCode2, "cpp"));
        System.out.println("JS1: " + extractFuncName(jsCode1, "js"));
        System.out.println("JS2: " + extractFuncName(jsCode2, "js"));
        System.out.println("PY1: " + extractFuncName(pyCode1, "python"));
        System.out.println("PY2: " + extractFuncName(pyCode2, "python"));
    }

    static String extractFuncName(String code, String lang) {
        Pattern p = null;
        if (lang.equals("cpp")) {
            p = Pattern.compile("(?:int|void|string|double|bool|vector<[^>]+>|TreeNode\\*?)\\s+([a-zA-Z0-9_]+)\\s*\\(");
        } else if (lang.equals("js")) {
            p = Pattern.compile("(?:(?:var|let|const)\\s+([a-zA-Z0-9_]+)\\s*=\\s*(?:function|\\([^)]*\\)\\s*=>)|function\\s+([a-zA-Z0-9_]+)\\s*\\()");
        } else if (lang.equals("python")) {
            p = Pattern.compile("def\\s+([a-zA-Z0-9_]+)\\s*\\(");
        }
        
        Matcher m = p.matcher(code);
        if (m.find()) {
            if (lang.equals("js")) {
                return m.group(1) != null ? m.group(1) : m.group(2);
            }
            return m.group(1);
        }
        return "UNKNOWN";
    }
}
