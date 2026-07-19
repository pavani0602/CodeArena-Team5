import { useEffect, useState, useRef } from 'react';
import './CodeEditor.css';
import { FaCode } from 'react-icons/fa';

// Store raw text instead of fixed HTML strings so it remains clean to edit
const BOILERPLATE_DATA = {
    python: `def twoSum(nums, target):\n    # Write your Python code here\n    pass`,
    java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your Java code here\n        return new int[0];\n    }\n}`,
    cpp: `#include <vector>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        // Write your C++ code here\n        return {};\n    }\n};`,
    javascript: `function twoSum(nums, target) {\n    // Write your JavaScript code here\n    \n}`
};

function CodeEditor({ selectedLang, setSelectedLang, onChange }) {
    const [codeText, setCodeText] = useState(BOILERPLATE_DATA.python);
    const editorRef = useRef(null);

    // Swap boilerplate text cleanly whenever language changes
    useEffect(() => {
        const defaultCode = BOILERPLATE_DATA[selectedLang] || BOILERPLATE_DATA.python;
        setCodeText(defaultCode);
        if (onChange) onChange(defaultCode); // Notify parent component layout state loop
        
        if (editorRef.current) {
            editorRef.current.innerText = defaultCode;
        }
    }, [selectedLang]);

    const handleInput = (e) => {
        const currentText = e.target.innerText;
        setCodeText(currentText);
        if (onChange) onChange(currentText); // Send updated code string straight to execution hook
    };

    // Calculate dynamic line rows based on string break points
    const linesCount = codeText.split('\n').length || 1;

    return (
        <section className="panel editor-panel">
            <div className="panel-tabs justify-between">
                <div className="tab-left">
                    <button className="tab-item active"><FaCode size={13} /> Code</button>
                </div>
                
                <div className="lang-dropdown-wrapper">
                    <select 
                        className="lang-dropdown" 
                        value={selectedLang} 
                        onChange={(e) => setSelectedLang(e.target.value)}
                    >
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="javascript">JavaScript</option>
                    </select>
                </div>
            </div>
            
            <div className="editor-workspace">
                {/* Dynamically expanding structural row side margins */}
                <div className="line-numbers-sidebar">
                    {Array.from({ length: linesCount }).map((_, index) => (
                        <div key={index} className="line-number">{index + 1}</div>
                    ))}
                </div>

                <div className="code-area-wrapper">
                    {/* contentEditable="true" makes standard tags fully interactive and typeable */}
                    <pre 
                        ref={editorRef}
                        className="code-editor-view"
                        contentEditable="true"
                        onInput={handleInput}
                        suppressContentEditableWarning={true}
                        style={{
                            outline: 'none',
                            whiteSpace: 'pre',
                            margin: 0,
                            fontFamily: 'monospace'
                        }}
                    />
                </div>
            </div>
        </section>
    );
}

export default CodeEditor;