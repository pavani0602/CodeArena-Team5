import { useEffect, useState } from 'react';
import './CodeEditor.css';
import { FaCode } from 'react-icons/fa';

const BOILERPLATE_DATA = {
    python: `<span class="token keyword">def</span> <span class="token function">twoSum</span>(nums, target):\n    <span class="token comment"># Write your Python code here</span>\n    <span class="token keyword">pass</span>`,
    java: `<span class="token keyword">class</span> <span class="token class-name">Solution</span> {\n    <span class="token keyword">public</span> <span class="token keyword">int</span>[] <span class="token function">twoSum</span>(<span class="token keyword">int</span>[] nums, <span class="token keyword">int</span> target) {\n        <span class="token comment">// Write your Java code here</span>\n        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token keyword">int</span>[0];\n    }\n}`,
    cpp: `<span class="token directive">#include</span> <span class="token string">&lt;vector&gt;</span>\n\n<span class="token keyword">class</span> <span class="token class-name">Solution</span> {\n<span class="token keyword">public</span>:\n    std::vector&lt;<span class="token keyword">int</span>&gt; <span class="token function">twoSum</span>(std::vector&lt;<span class="token keyword">int</span>&gt;&amp; nums, <span class="token keyword">int</span> target) {\n        <span class="token comment">// Write your C++ code here</span>\n        <span class="token keyword">return</span> {};\n    }\n};`,
    javascript: `<span class="token keyword">function</span> <span class="token function">twoSum</span>(nums, target) {\n    <span class="token comment">// Write your JavaScript code here</span>\n    \n}`
};

function CodeEditor({ selectedLang, setSelectedLang }) {
    const [htmlContent, setHtmlContent] = useState(BOILERPLATE_DATA.python);

    // Track active changes when language selections swap or route updates
    useEffect(() => {
        setHtmlContent(BOILERPLATE_DATA[selectedLang] || BOILERPLATE_DATA.python);
    }, [selectedLang]);

    const linesCount = htmlContent.split('\n').length;

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
                <div className="line-numbers-sidebar">
                    {Array.from({ length: linesCount }).map((_, index) => (
                        <div key={index} className="line-number">{index + 1}</div>
                    ))}
                </div>

                <div className="code-area-wrapper">
                    <pre className="code-editor-view">
                        <code dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    </pre>
                </div>
            </div>
        </section>
    );
}

export default CodeEditor;