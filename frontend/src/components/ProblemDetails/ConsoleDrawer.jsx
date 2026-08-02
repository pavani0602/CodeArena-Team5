import React, { useState } from 'react';
import { FaTerminal, FaTimes, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaVial, FaTimesCircle } from 'react-icons/fa';
import './ConsoleDrawer.css';

export default function ConsoleDrawer({ 
    isOpen, 
    onClose, 
    currentState, 
    currentTestIndex, 
    totalTestCases, 
    feedback 
}) {
    const [activeTab, setActiveTab] = useState('console');
    const [selectedTestCase, setSelectedTestCase] = useState(0);
    const [activeResultTest, setActiveResultTest] = useState(0);

    const sampleTestCases = [
        { id: 1, input: 's = "abcabcbb"', expected: '3', actual: '3' },
        { id: 2, input: 's = "bbbbb"', expected: '1', actual: '1' },
        { id: 3, input: 's = "pwwkew"', expected: '3', actual: '2' }
    ];

    if (!isOpen) return null;

    const progressPercent = totalTestCases > 0 
        ? Math.min((currentTestIndex / totalTestCases) * 100, 100) 
        : 0;

    return (
        <div className="console-drawer-overlay animate-slide-up">
            <div className="console-header">
                <div className="console-title-group">
                    <div className="console-nav-tabs">
                        <button 
                            className={`console-nav-btn ${activeTab === 'testcases' ? 'active' : ''}`}
                            onClick={() => setActiveTab('testcases')}
                        >
                            <FaVial className="nav-icon" size={10} /> Sample Test Cases
                        </button>
                        <button 
                            className={`console-nav-btn ${activeTab === 'console' ? 'active' : ''}`}
                            onClick={() => setActiveTab('console')}
                        >
                            <FaTerminal className="nav-icon" /> Output Results
                        </button>
                    </div>
                </div>
                <button className="console-close-btn" onClick={onClose} title="Close Console">
                    <FaTimes />
                </button>
            </div>

            <div className="console-body">
                {activeTab === 'testcases' ? (
                    <div className="test-cases-panel-view">
                        <div className="tc-tabs-row">
                            {sampleTestCases.map((tc, idx) => (
                                <button 
                                    key={tc.id}
                                    className={`tc-pill-tab ${selectedTestCase === idx ? 'active' : ''}`}
                                    onClick={() => setSelectedTestCase(idx)}
                                >
                                    Case {tc.id}
                                </button>
                            ))}
                        </div>
                        <div className="tc-content-box">
                            <div className="tc-field-group">
                                <label>Input Data:</label>
                                <div className="tc-code-block font-mono">{sampleTestCases[selectedTestCase].input}</div>
                            </div>
                            <div className="tc-field-group">
                                <label>Expected Output:</label>
                                <div className="tc-code-block font-mono">{sampleTestCases[selectedTestCase].expected}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {currentState === 'COMPILING' && (
                            <div className="status-container status-loading">
                                <FaSpinner className="spinner-icon" />
                                <h3>Compiling Code Architecture...</h3>
                                <p>Running syntax validation checks and checking structure guidelines.</p>
                            </div>
                        )}

                        {currentState === 'RUNNING_TESTS' && (
                            <div className="status-container status-loading">
                                <FaSpinner className="spinner-icon" />
                                <h3>Evaluating Test Cases...</h3>
                                <p>Passing execution blocks down evaluation matrix pipeline.</p>
                                <div className="progress-bar-wrapper">
                                    <div className="progress-bar-label">
                                        <span>Progress</span>
                                        <span>{currentTestIndex} / {totalTestCases} Passed</span>
                                    </div>
                                    <div className="progress-bar-track">
                                        <div 
                                            className="progress-bar-fill" 
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentState === 'COMPILE_ERROR' && (
                            <div className="status-container status-error">
                                <div className="verdict-banner error-banner">
                                    <FaExclamationTriangle />
                                    <span>Compilation Failed</span>
                                </div>
                                <div className="compiler-error-box">
                                    <div className="error-line-badge">Line {feedback?.line || 'N/A'}</div>
                                    <pre className="terminal-stack-trace font-mono">
                                        {feedback?.message || "Syntax error detected in source code."}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {(currentState === 'SUCCESS' || currentState === 'FAILED_TEST') && (
                            <div className="status-container">
                                <div className={`verdict-banner ${currentState === 'SUCCESS' ? 'success-banner' : 'failed-banner'}`}>
                                    {currentState === 'SUCCESS' ? <FaCheckCircle /> : <FaTimesCircle />}
                                    <span>{currentState === 'SUCCESS' ? 'Accepted (All Test Cases Passed)' : 'Wrong Answer'}</span>
                                </div>

                                <p className="status-context-msg">
                                    {currentState === 'SUCCESS' 
                                        ? 'Your solution successfully verified all test suites.' 
                                        : 'One or more test cases failed execution validation.'}
                                </p>

                                <div className="test-cases-panel-view">
                                    <div className="tc-tabs-row">
                                        {sampleTestCases.map((tc, idx) => {
                                            const isPassed = currentState === 'SUCCESS' ? true : idx < 2;
                                            return (
                                                <button 
                                                    key={tc.id}
                                                    className={`tc-pill-tab ${activeResultTest === idx ? 'active' : ''}`}
                                                    onClick={() => setActiveResultTest(idx)}
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                                >
                                                    {isPassed ? <FaCheckCircle size={11} color="#10b981" /> : <FaTimesCircle size={11} color="#ef4444" />}
                                                    Test {tc.id}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="tc-content-box" style={{ marginTop: '4px' }}>
                                        <div className="tc-field-group">
                                            <label>Input:</label>
                                            <div className="tc-code-block font-mono">{sampleTestCases[activeResultTest].input}</div>
                                        </div>
                                        <div className="tc-field-group">
                                            <label>Expected Output:</label>
                                            <div className="tc-code-block font-mono">{sampleTestCases[activeResultTest].expected}</div>
                                        </div>
                                        <div className="tc-field-group">
                                            <label>Recieved Output:</label>
                                            <div 
                                                className="tc-code-block font-mono" 
                                                style={{ 
                                                    color: (currentState === 'SUCCESS' || activeResultTest < 2) ? '#10b981' : '#ef4444',
                                                    borderColor: (currentState === 'SUCCESS' || activeResultTest < 2) ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
                                                }}
                                            >
                                                {sampleTestCases[activeResultTest].actual}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {currentState === 'SUCCESS' && (
                                    <div className="metrics-row-display" style={{ marginTop: '16px' }}>
                                        <div className="metric-score-card">
                                            <span className="metric-label">Runtime Speed</span>
                                            <span className="metric-value value-green">{feedback?.runtime || "38 ms"}</span>
                                        </div>
                                        <div className="metric-score-card">
                                            <span className="metric-label">Memory Footprint</span>
                                            <span className="metric-value value-green">{feedback?.memory || "15.8 MB"}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}