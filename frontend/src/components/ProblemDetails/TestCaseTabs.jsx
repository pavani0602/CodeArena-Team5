import { useState } from 'react';
import './TestCaseTabs.css';

data = [
    { id: 1, input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
    { id: 2, input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
    { id: 3, input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' }
];

function TestCaseTabs() {
    const [activeTab, setActiveTab] = useState(testcases);

    return (
        <div className="test-case-container">
            <div className="test-case-header">
                <span>Test Cases</span>
                <div className="test-case-tabs">
                    {testCases.map((tc, index) => (
                        <button
                            key={tc.id}
                            className={`tc-tab-btn ${activeTab === index ? 'active' : ''}`}
                            onClick={() => setActiveTab(index)}
                        >
                            Case {tc.id}
                        </button>
                    ))}
                </div>
            </div>

            <div className="test-case-body">
                <div className="tc-field">
                    <label>Input:</label>
                    <div className="tc-box font-mono">{testCases[activeTab].input}</div>
                </div>
                <div className="tc-field">
                    <label>Expected Output:</label>
                    <div className="tc-box font-mono">{testCases[activeTab].output}</div>
                </div>
            </div>
        </div>
    );
}

export default TestCaseTabs;