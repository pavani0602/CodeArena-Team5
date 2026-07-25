import { useEffect, useState, useRef } from 'react';
import './CodeEditor.css';
import { FaCode, FaUndo, FaExclamationTriangle } from 'react-icons/fa';
import { fetchApi } from '../../services/api';
import Editor from '@monaco-editor/react';

const FALLBACK_BOILERPLATE = {
    python: `def twoSum(nums, target):\n    # Write your Python code here\n    pass`,
    java: `public int[] twoSum(int[] nums, int target) {\n    // Write your Java code here\n    return new int[0];\n}`,
    cpp: `std::vector<int> twoSum(std::vector<int>& nums, int target) {\n    // Write your C++ code here\n    return {};\n}`,
    javascript: `function twoSum(nums, target) {\n    // Write your JavaScript code here\n    \n}`
};

function CodeEditor({ selectedLang, setSelectedLang, onChange, problemTitle }) {
    const [codeText, setCodeText] = useState(FALLBACK_BOILERPLATE.python);
    const [boilerplateMap, setBoilerplateMap] = useState(FALLBACK_BOILERPLATE);
    const [isConfirming, setIsConfirming] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!problemTitle) return;

        const loadMetadata = async () => {
            try {
                const response = await fetchApi(`/api/problems/metadata/${encodeURIComponent(problemTitle)}`);
                if (response.ok) {
                    const metadata = await response.json();
                    const { functionName, parameterNames, parameterTypes, returnType } = metadata;
                    
                    const pythonParams = parameterNames.join(', ');
                    const pythonBoilerplate = `def ${functionName}(${pythonParams}):\n    # Write your Python code here\n    pass`;

                    const javaParams = parameterNames.map((n, i) => `${parameterTypes[i]} ${n}`).join(', ');
                    const javaDefaultReturn = returnType === 'int' ? '0' : returnType === 'double' ? '0.0' : returnType === 'boolean' ? 'false' : returnType.includes('[]') ? `new ${returnType}{}` : 'null';
                    const javaBoilerplate = `public ${returnType} ${functionName}(${javaParams}) {\n    // Write your Java code here\n    return ${javaDefaultReturn};\n}`;

                    const mapCppType = (t) => {
                        if (t === 'int') return 'int';
                        if (t === 'double') return 'double';
                        if (t === 'string') return 'std::string';
                        if (t === 'int[]') return 'std::vector<int>';
                        if (t === 'int[][]') return 'std::vector<std::vector<int>>';
                        if (t === 'char[]') return 'std::vector<char>';
                        if (t === 'TreeNode') return 'TreeNode*';
                        if (t === 'boolean') return 'bool';
                        if (t === 'string[][]') return 'std::vector<std::vector<std::string>>';
                        return t;
                    };
                    const cppParams = parameterNames.map((n, i) => {
                        const t = mapCppType(parameterTypes[i]);
                        return (t.includes('vector') || t.includes('string')) ? `${t}& ${n}` : `${t} ${n}`;
                    }).join(', ');
                    const cppReturnType = mapCppType(returnType);
                    const cppDefaultReturn = cppReturnType === 'int' || cppReturnType === 'double' ? '0' : cppReturnType === 'bool' ? 'false' : '{}';
                    const cppBoilerplate = `${cppReturnType} ${functionName}(${cppParams}) {\n    // Write your C++ code here\n    return ${cppDefaultReturn};\n}`;

                    setBoilerplateMap({
                        python: pythonBoilerplate,
                        java: javaBoilerplate,
                        cpp: cppBoilerplate,
                        javascript: `var ${functionName} = function(${pythonParams}) {\n    // Write your JS code here\n};`
                    });
                }
            } catch (err) {
                console.error("Failed to load boilerplate metadata", err);
            }
        };
        loadMetadata();
    }, [problemTitle]);

    // Swap boilerplate text cleanly whenever language or boilerplateMap changes
    useEffect(() => {
        const defaultCode = boilerplateMap[selectedLang] || boilerplateMap.python;
        setCodeText(defaultCode);
        if (onChange) onChange(defaultCode); 
        setIsConfirming(false); // Reset confirmation state if they switch languages
    }, [selectedLang]);

    // Clean up timer on unmount
    useEffect(() => {
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, []);

    const handleEditorChange = (value) => {
        const currentText = value || '';
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

        const originalTemplate = boilerplateMap[selectedLang] || boilerplateMap.python;
        setCodeText(originalTemplate);
        if (onChange) onChange(originalTemplate);
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
            
            <div className="editor-workspace" style={{ height: '500px', width: '100%' }}>
                <Editor
                    height="100%"
                    language={selectedLang}
                    theme="vs-dark"
                    value={codeText}
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                />
            </div>
        </section>
    );
}

export default CodeEditor;