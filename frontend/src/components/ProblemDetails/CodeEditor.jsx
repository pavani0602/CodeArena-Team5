import { useEffect, useState, useRef } from 'react';
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
    const [isConfirming, setIsConfirming] = useState(false); // Track inline reset confirmation state
    const editorRef = useRef(null);
    const timerRef = useRef(null);

    // Swap boilerplate text cleanly whenever language changes
    useEffect(() => {
        const defaultCode = BOILERPLATE_DATA[selectedLang] || BOILERPLATE_DATA.python;
        setCodeText(defaultCode);
        if (onChange) onChange(defaultCode); 
        
        if (editorRef.current) {
            editorRef.current.innerText = defaultCode;
        }
        setIsConfirming(false); // Reset confirmation state if they switch languages
    }, [selectedLang]);

    // Clean up timer on unmount
    useEffect(() => {
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, []);

    const handleInput = (e) => {
        const currentText = e.target.innerText;
        setCodeText(currentText);
        if (onChange) onChange(currentText); 
    };

    // 🔄 Smooth Inline Reset Handler
    const handleResetCode = () => {
        if (!isConfirming) {
            // First click: prompt for confirmation inline
            setIsConfirming(true);
            
            // Auto-cancel confirmation after 4 seconds of inactivity
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setIsConfirming(false);
            }, 4000);
            return;
        }

        // Second click: perform the actual structural reset
        if (timerRef.current) clearTimeout(timerRef.current);
        setIsConfirming(false);

        const originalTemplate = BOILERPLATE_DATA[selectedLang] || BOILERPLATE_DATA.python;
        setCodeText(originalTemplate);
        if (onChange) onChange(originalTemplate);

        if (editorRef.current) {
            editorRef.current.innerText = originalTemplate;
        }
    };

    // Dynamic line numbers based on code text row splits
    const linesCount = codeText.split('\n').length || 1;

    return (
        <section className="panel editor-panel">
            <div className="panel-tabs justify-between">
                <div className="tab-left">
                    <button className="tab-item active"><FaCode size={13} /> Code</button>
                </div>
                
                <div className="editor-controls-right">
                    <button 
                        className={`reset-code-btn ${isConfirming ? 'confirm-mode' : ''}`}
                        onClick={handleResetCode}
                        onMouseLeave={() => {
                            // Optional comfort feature: reset warning if mouse leaves button area long enough
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
            
            <div className="editor-workspace">
                <div className="line-numbers-sidebar">
                    {Array.from({ length: linesCount }).map((_, index) => (
                        <div key={index} className="line-number">{index + 1}</div>
                    ))}
                </div>

                <div className="code-area-wrapper">
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