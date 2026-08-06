import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';
import { FaCode, FaUndo, FaExclamationTriangle } from 'react-icons/fa';
import { fetchApi } from '../../services/api';

const FALLBACK_BOILERPLATE = {
    python: `def twoSum(nums, target):\n    # Write your Python code here\n    pass`,
    java: `public int[] twoSum(int[] nums, int target) {\n    // Write your Java code here\n    return new int[0];\n}`,
    cpp: `std::vector<int> twoSum(std::vector<int>& nums, int target) {\n    // Write your C++ code here\n    return {};\n}`,
    javascript: `function twoSum(nums, target) {\n    // Write your JavaScript code here\n    \n}`
};

function CodeEditor({ selectedLang, setSelectedLang, value, onChange, compileError, problemTitle }) {
    const [boilerplateMap, setBoilerplateMap] = useState(FALLBACK_BOILERPLATE);
    const [isConfirming, setIsConfirming] = useState(false);
    const timerRef = useRef(null);
    const editorRef = useRef(null);
    const monacoRef = useRef(null);

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
        // If there's no code provided yet (or on initial switch), set boilerplate
        // Actually, if we switch languages we usually want to reset to boilerplate
        const defaultCode = boilerplateMap[selectedLang] || boilerplateMap.python;
        if (onChange) onChange(defaultCode); 
        setIsConfirming(false); // Reset confirmation state if they switch languages
        
        // Clear markers on reset
        if (editorRef.current && monacoRef.current) {
            const model = editorRef.current.getModel();
            if (model) monacoRef.current.editor.setModelMarkers(model, "compiler", []);
        }
    }, [selectedLang]);

    // Clean up timer on unmount
    useEffect(() => {
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, []);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
    };

    // Watch for compile errors and apply line markers/decorations in Monaco
    useEffect(() => {
        if (!editorRef.current || !monacoRef.current) return;

        const model = editorRef.current.getModel();
        if (!model) return;

        if (compileError && compileError.line) {
            // Set error squiggly lines and warning flags on the specific line number
            monacoRef.current.editor.setModelMarkers(model, "compiler", [
                {
                    startLineNumber: compileError.line,
                    startColumn: compileError.column || 1,
                    endLineNumber: compileError.line,
                    endColumn: compileError.endColumn || 1000,
                    message: compileError.message || "Compilation Error",
                    severity: monacoRef.current.MarkerSeverity.Error,
                }
            ]);
        } else {
            // Clear markers if there is no error
            monacoRef.current.editor.setModelMarkers(model, "compiler", []);
        }
    }, [compileError]);

    const handleEditorChange = (newValue) => {
        const text = newValue || '';
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

        const originalTemplate = boilerplateMap[selectedLang] || boilerplateMap.python;
        if (onChange) onChange(originalTemplate);
        
        // Clear markers on reset
        if (editorRef.current && monacoRef.current) {
            const model = editorRef.current.getModel();
            if (model) monacoRef.current.editor.setModelMarkers(model, "compiler", []);
        }
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
                    value={value} 
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 4,
                    }}
                />
            </div>
        </section>
    );
}

export default CodeEditor;
