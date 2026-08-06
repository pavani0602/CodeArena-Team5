import React, { useState } from 'react';
import { FaTerminal, FaTimes, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaVial, FaTimesCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './ConsoleDrawer.css';

export default function ConsoleDrawer({ 
    isOpen, 
    onClose, 
    currentState, 
    currentTestIndex, 
    totalTestCases, 
    feedback,
    testCases = []
}) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('console');
    const [selectedTestCase, setSelectedTestCase] = useState(0);
    const [activeResultTest, setActiveResultTest] = useState(0);

    const sampleTestCases = testCases.length > 0 
        ? testCases.filter(tc => !tc.hidden).map((tc, idx) => ({
            id: idx + 1,
            input: tc.inputData,
            expected: tc.expectedOutput,
            actual: tc.expectedOutput // Used as fallback when showing successful test case results
        })) 
        : [
            { id: 1, input: 'N/A', expected: 'N/A', actual: 'N/A' }
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
                            <FaVial className="nav-icon" size={10} /> {t('problemDetails.console.sampleTestCases')}
                        </button>
                        <button 
                            className={`console-nav-btn ${activeTab === 'console' ? 'active' : ''}`}
                            onClick={() => setActiveTab('console')}
                        >
                            <FaTerminal className="nav-icon" /> {t('problemDetails.console.outputResults')}
                        </button>
                    </div>
                </div>
                <button className="console-close-btn" onClick={onClose} title={t('problemDetails.console.closeConsole')}>
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
                                    {t('problemDetails.console.caseLabel', { number: tc.id })}
                                </button>
                            ))}
                        </div>
                        <div className="tc-content-box">
                            <div className="tc-field-group">
                                <label>{t('problemDetails.console.inputData')}</label>
                                <div className="tc-code-block font-mono">{sampleTestCases[selectedTestCase].input}</div>
                            </div>
                            <div className="tc-field-group">
                                <label>{t('problemDetails.console.expectedOutput')}</label>
                                <div className="tc-code-block font-mono">{sampleTestCases[selectedTestCase].expected}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {currentState === 'COMPILING' && (
                            <div className="status-container status-loading">
                                <FaSpinner className="spinner-icon" />
                                <h3>{t('problemDetails.console.compiling')}</h3>
                                <p>{t('problemDetails.console.compilingSubtext')}</p>
                            </div>
                        )}

                        {currentState === 'RUNNING_TESTS' && (
                            <div className="status-container status-loading">
                                <FaSpinner className="spinner-icon" />
                                <h3>{t('problemDetails.console.evaluating')}</h3>
                                <p>{t('problemDetails.console.evaluatingSubtext')}</p>
                                <div className="progress-bar-wrapper">
                                    <div className="progress-bar-label">
                                        <span>{t('problemDetails.console.progress')}</span>
                                        <span>{currentTestIndex} / {totalTestCases} {t('problemDetails.console.passed')}</span>
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
                                    <span>{t('problemDetails.console.compilationFailed')}</span>
                                </div>
                                <div className="compiler-error-box">
                                    <div className="error-line-badge">{t('problemDetails.console.line', { line: feedback?.line || 'N/A' })}</div>
                                    <pre className="terminal-stack-trace font-mono" style={{ whiteSpace: 'pre-wrap' }}>
                                        {feedback?.message || t('problemDetails.console.syntaxErrorFallback')}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {(currentState === 'SUCCESS' || currentState === 'FAILED_TEST') && (
                            <div className="status-container">
                                <div className={`verdict-banner ${currentState === 'SUCCESS' ? 'success-banner' : 'failed-banner'}`}>
                                    {currentState === 'SUCCESS' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                                    <span>
                                        {currentState === 'SUCCESS' ? t('problemDetails.console.accepted') : 
                                         feedback?.status === 'RUNTIME_ERROR' ? t('problemDetails.console.runtimeError') : t('problemDetails.console.wrongAnswer')}
                                    </span>
                                </div>

                                <p className="status-context-msg">
                                    {currentState === 'SUCCESS' 
                                        ? t('problemDetails.console.successMessage') 
                                        : (feedback?.status === 'RUNTIME_ERROR' 
                                            ? t('problemDetails.console.runtimeMessage') 
                                            : t('problemDetails.console.wrongAnswerMessage'))}
                                </p>

                                {currentState === 'FAILED_TEST' && feedback?.status === 'RUNTIME_ERROR' ? (
                                    <div className="compiler-error-box" style={{ marginTop: '15px' }}>
                                        <pre className="terminal-stack-trace font-mono" style={{ color: '#f87171', whiteSpace: 'pre-wrap' }}>
                                            {feedback?.errorTrace || feedback?.message || t('errors.runtimeErrorFallback')}
                                        </pre>
                                    </div>
                                ) : (
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
                                                        {t('problemDetails.console.testLabel', { number: tc.id })}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="tc-content-box" style={{ marginTop: '4px' }}>
                                            {currentState === 'FAILED_TEST' && feedback?.expectedOutput && (
                                                <>
                                                    <div className="tc-field-group">
                                                        <label>{t('problemDetails.console.inputDynamic')}</label>
                                                        <div className="tc-code-block font-mono">{feedback?.input || sampleTestCases[activeResultTest].input}</div>
                                                    </div>
                                                    <div className="tc-field-group">
                                                        <label>{t('problemDetails.console.expectedOutput')}</label>
                                                        <div className="tc-code-block font-mono">{feedback?.expectedOutput}</div>
                                                    </div>
                                                    <div className="tc-field-group">
                                                        <label>{t('problemDetails.console.receivedOutput')}</label>
                                                        <div 
                                                            className="tc-code-block font-mono" 
                                                            style={{ 
                                                                color: '#ef4444',
                                                                borderColor: 'rgba(239, 68, 68, 0.3)'
                                                            }}
                                                        >
                                                            {feedback?.userOutput || t('common.none')}
                                                        </div>
                                                    </div>
                                                </>
                                            ) || (
                                                <>
                                                    <div className="tc-field-group">
                                                        <label>{t('problemDetails.console.input')}</label>
                                                        <div className="tc-code-block font-mono">{sampleTestCases[activeResultTest].input}</div>
                                                    </div>
                                                    <div className="tc-field-group">
                                                        <label>{t('problemDetails.console.expectedOutput')}</label>
                                                        <div className="tc-code-block font-mono">{sampleTestCases[activeResultTest].expected}</div>
                                                    </div>
                                                    <div className="tc-field-group">
                                                        <label>{t('problemDetails.console.receivedOutput')}</label>
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
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {currentState === 'SUCCESS' && (
                                    <div className="metrics-row-display" style={{ marginTop: '16px' }}>
                                        <div className="metric-score-card">
                                            <span className="metric-label">{t('problemDetails.console.runtimeSpeed')}</span>
                                            <span className="metric-value value-green">{feedback?.runtime || "38 ms"}</span>
                                        </div>
                                        <div className="metric-score-card">
                                            <span className="metric-label">{t('problemDetails.console.memoryFootprint')}</span>
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
