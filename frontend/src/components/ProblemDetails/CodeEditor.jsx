import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';
import { FaCode, FaUndo, FaExclamationTriangle } from 'react-icons/fa';

const BOILERPLATE_DATA = {
    python: `def twoSum(nums, target):\n    # Write your Python code here\n    pass`,
    java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your Java code here\n        return new int[0];\n    }\n}`,
    cpp: `#include <vector>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        // Write your C++ code here\n        return {};\n    }\n};`,
    javascript: `function twoSum(nums, target) {\n    // Write your JavaScript code here\n    \n}`
};

function CodeEditor({ selectedLang, setSelectedLang, onChange }) {
    const [codeText, setCodeText] = useState(BOILERPLATE_DATA.python);
    const [isConfirming, setIsConfirming] = useState(false);
    const timerRef = useRef(null);

    // Swap boilerplate text cleanly whenever language changes
    useEffect(() => {
        const defaultCode = BOILERPLATE_DATA[selectedLang] || BOILERPLATE_DATA.python;
        setCodeText(defaultCode);
        if (onChange) onChange(defaultCode); 
        setIsConfirming(false);
    }, [selectedLang]);

    // Clean up timer on unmount
    useEffect(() => {
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, []);

    const handleEditorChange = (newValue) => {
        const text = newValue || '';
        setCodeText(text);
        if (onChange) onChange(text);
    };

    // Map application language keys to Monaco language identifiers
    const getMonacoLanguage = (lang) => {
        switch (lang?.toLowerCase()) {
            case 'cpp':
            case 'c++': return 'cpp';
            case 'java': return 'java';
            case 'python': return 'python';
            case 'javascript':
            case 'js': return 'javascript';
            default: return 'javascript';
        }
    };

    // 🔄 Smooth Inline Reset Handler
    const handleResetCode = () => {
        if (!isConfirming) {
            setIsConfirming(true);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setIsConfirming(false);
            }, 4000);
            return;
        }

        if (timerRef.current) clearTimeout(timerRef.current);
        setIsConfirming(false);

        const originalTemplate = BOILERPLATE_DATA[selectedLang] || BOILERPLATE_DATA.python;
        setCodeText(originalTemplate);
        if (onChange) onChange(originalTemplate);
    };

    return (
        <section className="panel editor-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="panel-tabs justify-between">
                <div className="tab-left">
                    <button className="tab-item active"><FaCode size={13} /> Code</button>
                </div>
                
                <div className="editor-controls-right">
                    <button 
                        className={`reset-code-btn ${isConfirming ? 'confirm-mode' : ''}`}
                        onClick={handleResetCode}
                        onMouseLeave={() => {
                            if (isConfirming) {
                                timerRef.current = setTimeout(() => setIsConfirming(false), 1500);
                            }
                        }}
                        title={isConfirming ? "Click again to confirm erasing changes" : "Reset code to template"}
                    >
                        {isConfirming ? (
                            <>
                                <FaExclamationTriangle size={11} /> Confirm Reset?
                            </>
                        ) : (
                            <>
                                <FaUndo size={10} /> 
                            </>
                        )}
                    </button>

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
            </div>
            
            <div className="editor-workspace" style={{ flex: 1, position: 'relative', width: '100%', minHeight: '350px' }}>
                <Editor
                    height="100%"
                    language={getMonacoLanguage(selectedLang)}
                    theme="vs-dark"
                    value={codeText}
                    onChange={handleEditorChange}
                    options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        tabSize: 4,
                    }}
                />
            </div>
        </section>
    );
}

export default CodeEditor;