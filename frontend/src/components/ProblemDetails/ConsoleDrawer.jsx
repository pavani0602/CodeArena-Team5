import React from 'react';
import { FaTerminal, FaTimes, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import './ConsoleDrawer.css';

export default function ConsoleDrawer({ 
    isOpen, 
    onClose, 
    currentState, 
    currentTestIndex, 
    totalTestCases, 
    feedback 
}) {
    // If the drawer is explicitly hidden, don't mount it to the DOM
    if (!isOpen) return null;

    // Calculate percentage progress for test case iterations
    const progressPercent = totalTestCases > 0 
        ? Math.min((currentTestIndex / totalTestCases) * 100, 100) 
        : 0;

    return (
        <div className="console-drawer-overlay animate-slide-up">
            {/* Console Header Bar */}
            <div className="console-header">
                <div className="console-title">
                    <FaTerminal className="console-icon" />
                    <span>Console Output</span>
                </div>
                <button className="console-close-btn" onClick={onClose} title="Close Console">
                    <FaTimes />
                </button>
            </div>

            {/* Console Body Window Workspace */}
            <div className="console-body">
                
                {/* 1. STATE: COMPILING LOADER */}
                {currentState === 'COMPILING' && (
                    <div className="status-container status-loading">
                        <FaSpinner className="spinner-icon" />
                        <h3>Compiling Code Architecture...</h3>
                        <p>Running syntax validation checks and checking structure guidelines.</p>
                    </div>
                )}

                {/* 2. STATE: RUNNING TEST CASES */}
                {currentState === 'RUNNING_TESTS' && (
                    <div className="status-container status-loading">
                        <FaSpinner className="spinner-icon" />
                        <h3>Evaluating Test Cases...</h3>
                        <p>Passing execution blocks down evaluation matrix pipeline.</p>
                        
                        {/* Progress Bar Container */}
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

                {/* 3. STATE: COMPILE ERROR */}
                {currentState === 'COMPILE_ERROR' && (
                    <div className="status-container status-error">
                        <div className="verdict-banner error-banner">
                            <FaExclamationTriangle />
                            <span>Compile Error</span>
                        </div>
                        <pre className="terminal-stack-trace">
                            {feedback?.message || "Unknown compilation failure syntax structure breakdown."}
                        </pre>
                    </div>
                )}

                {/* 4. STATE: WRONG ANSWER / RUNTIME ERROR (FAILED TEST CASE) */}
                {currentState === 'FAILED_TEST' && (
                    <div className="status-container status-failed">
                        <div className="verdict-banner failed-banner">
                            <FaExclamationTriangle />
                            <span>{feedback?.status === 'RUNTIME_ERROR' ? 'Runtime Error' : 'Wrong Answer (Verdict Failed)'}</span>
                        </div>
                        
                        <p className="status-context-msg">{feedback?.status === 'RUNTIME_ERROR' ? "Your code crashed during execution." : "Your code logic broke on an evaluation test edge case window."}</p>
                        
                        {feedback?.status === 'RUNTIME_ERROR' ? (
                            <pre className="terminal-stack-trace" style={{marginTop: '15px', color: '#f87171'}}>
                                {feedback?.errorTrace || feedback?.message || "Unknown error occurred"}
                            </pre>
                        ) : (
                            <div className="diff-analysis-grid">
                                <div className="diff-card">
                                    <h4>Expected System Output</h4>
                                    <div className="diff-box expected-box">
                                        <code>{feedback?.expectedOutput || "N/A"}</code>
                                    </div>
                                </div>
                                <div className="diff-card">
                                    <h4>Your Code Output Result</h4>
                                    <div className="diff-box actual-box">
                                        <code>{feedback?.userOutput || "None"}</code>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 5. STATE: SUCCESS (ACCEPTED SOLUTIONS) */}
                {currentState === 'SUCCESS' && (
                    <div className="status-container status-success">
                        <div className="verdict-banner success-banner">
                            <FaCheckCircle />
                            <span>Accepted (All Test Cases Passed!)</span>
                        </div>
                        
                        <p className="status-context-msg">Excellent! Your execution metrics hit code solution parameters cleanly.</p>
                        
                        {/* Added Comparative Grid for successful evaluations as well */}
                        <div className="diff-analysis-grid" style={{ marginBottom: '20px' }}>
                            <div className="diff-card">
                                <h4>Expected System Output</h4>
                                <div className="diff-box expected-box" style={{ borderColor: '#10b981' }}>
                                    <code>{feedback?.expectedOutput || "N/A"}</code>
                                </div>
                            </div>
                            <div className="diff-card">
                                <h4>Your Code Output Result</h4>
                                <div className="diff-box actual-box" style={{ borderColor: '#10b981' }}>
                                    <code>{feedback?.userOutput || "None"}</code>
                                </div>
                            </div>
                        </div>

                        {/* Performance Metric Scorecards */}
                        <div className="metrics-row-display">
                            <div className="metric-score-card">
                                <span className="metric-label">Runtime Speed</span>
                                <span className="metric-value value-green">{feedback?.runtime || "45 ms"}</span>
                            </div>
                            <div className="metric-score-card">
                                <span className="metric-label">Memory Footprint</span>
                                <span className="metric-value value-green">{feedback?.memory || "16.4 MB"}</span>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}