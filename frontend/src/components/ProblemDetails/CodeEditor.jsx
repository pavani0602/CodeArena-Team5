import { useState, useEffect } from "react";
import "./CodeEditor.css";

// Boilerplate data structured by Problem ID -> Language
const BOILERPLATE_CODE = {
    "1": {
        python: "def twoSum(nums, target):\n    # Write your Python code here\n    pass",
        java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your Java code here\n        return new int[0];\n    }\n}",
        cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your C++ code here\n        return {};\n    }\n};"
    },
    "2": {
        python: "def isValid(s: str) -> bool:\n    # Write your Python code here\n    pass",
        java: "class Solution {\n    public boolean isValid(String s) {\n        // Write your Java code here\n        return false;\n    }\n}",
        cpp: "class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your C++ code here\n        return false;\n    }\n};"
    }
    // You can add 3 through 12 following this same layout pattern later!
};

function CodeEditor({ problemId }) {
    // 1. Keep track of the selected language (default to Python)
    const [language, setLanguage] = useState("python");
    const [code, setCode] = useState("");

    // 2. Change code when the problem or language switches
    useEffect(() => {
        const problemTemplates = BOILERPLATE_CODE[problemId];
        if (problemTemplates && problemTemplates[language]) {
            setCode(problemTemplates[language]);
        } else {
            // Fallback template if specific problem data isn't written out yet
            const generalFallbacks = {
                python: "# Write your Python code here\n",
                java: "class Solution {\n    // Write your Java code here\n}",
                cpp: "// Write your C++ code here\n"
            };
            setCode(generalFallbacks[language]);
        }
    }, [problemId, language]);

    return (
        <div className="code-editor-container">
            <div className="editor-header">
                {/* Dynamically update the extension tag in the corner */}
                <span>
                    {language === "python" && "solution.py"}
                    {language === "java" && "Solution.java"}
                    {language === "cpp" && "solution.cpp"}
                </span>
                
                {/* Updated Language Dropdown */}
                <select 
                    className="language-select" 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                </select>
            </div>
            
            <textarea
                className="code-textarea"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
            />
        </div>
    );
}

export default CodeEditor;