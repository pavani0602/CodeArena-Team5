import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaRandom, FaExclamationTriangle } from 'react-icons/fa';
import ProblemDescription from '../../components/ProblemDetails/ProblemDescription';
import CodeEditor from '../../components/ProblemDetails/CodeEditor';
import ActionButtons from '../../components/ProblemDetails/ActionButtons';
import ConsoleDrawer from '../../components/ProblemDetails/ConsoleDrawer'; 
import { useSubmissionStateMachine } from '../../hooks/useSubmissionStateMachine'; 
import './ProblemDetails.css';

const MOCK_PROBLEMS = {
    1: {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        tags: ["Array", "Hash Table"],
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.",
        exampleInput: "nums = [2,7,11,15], target = 9",
        exampleOutput: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
        testCases: [{ expectedOutput: "[0,1]" }, { expectedOutput: "[1,2]" }] 
    },
    2: {
        id: 2,
        title: "Valid Parentheses",
        difficulty: "Easy",
        tags: ["String", "Stack"],
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets.",
        exampleInput: 's = "()[]{}"',
        exampleOutput: "true",
        explanation: "All brackets are closed sequentially in correct matching pairs.",
        testCases: [{ expectedOutput: "true" }, { expectedOutput: "false" }]
    },
    3: {
        id: 3,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        tags: ["Hash Table", "String", "Sliding Window"],
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        exampleInput: 's = "abcabcbb"',
        exampleOutput: "3",
        explanation: "The answer is \"abc\", with the length of 3.",
        testCases: [{ expectedOutput: "3" }, { expectedOutput: "1" }]
    }
};

function ProblemDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const currentId = parseInt(id) || 1;
    const problem = MOCK_PROBLEMS[currentId] || MOCK_PROBLEMS[1];

    // Lifted States
    const [selectedLang, setSelectedLang] = useState('python');
    const [userCode, setUserCode] = useState(''); 
    const [isConsoleOpen, setIsConsoleOpen] = useState(false); 
    
    // Rate limit tracking state & modal visibility
    const [submissionTimestamps, setSubmissionTimestamps] = useState([]);
    const [showRateLimitModal, setShowRateLimitModal] = useState(false);
    
    // Dynamic array tracker to manage solution submission history profiles
    const [submissionHistory, setSubmissionHistory] = useState([]);
    const [isSubmitTriggered, setIsSubmitTriggered] = useState(false);

    // Initialize State Machine Hook
    const {
        currentState,
        currentTestIndex,
        feedback,
        simulateExecution,
        totalTestCases
    } = useSubmissionStateMachine(problem);

    // Watcher effect loop: Automatically detects when submission execution completes
    useEffect(() => {
        if (isSubmitTriggered && (currentState === 'SUCCESS' || currentState === 'FAILED_TEST')) {
            // const newSubmission = {
            //     status: feedback?.status || (currentState === 'SUCCESS' ? 'Accepted' : 'Wrong Answer'),
            //     language: selectedLang.charAt(0).toUpperCase() + selectedLang.slice(1),
            //     runtime: feedback?.runtime || "N/A",
            //     timeSubmitted: "Just now"
            // };

            // Prepend new record directly into history state container
            const newSubmission = {
                status: feedback?.status || (currentState === 'SUCCESS' ? 'Accepted' : 'Wrong Answer'),
                language: selectedLang.charAt(0).toUpperCase() + selectedLang.slice(1),
                runtime: feedback?.runtime || "45 ms",
                memory: "14.2 MB", // 🛑 Add memory tracking property
                timeSubmitted: "Just now",
                // 🛑 Add sample individual test case breakdowns for your UI later
                testCasesBreakdown: [
                    { id: 1, status: "Passed", runtime: "12 ms", memory: "12.1 MB" },
                    { id: 2, status: "Passed", runtime: "15 ms", memory: "13.4 MB" },
                    { id: 3, status: currentState === 'SUCCESS' ? "Passed" : "Failed", runtime: "18 ms", memory: "14.2 MB" }
                ]
            };
            
            setSubmissionHistory(prev => [newSubmission, ...prev]);
            setIsSubmitTriggered(false); // Reset tracking flag trigger
        }
    }, [currentState, feedback, isSubmitTriggered, selectedLang]);

    // Clear submission window data view arrays whenever problem route swaps
    useEffect(() => {
        setSubmissionHistory([]);
    }, [currentId]);

    // Guard checks
    const checkAuth = (actionType) => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        
        if (!token) {
            const confirmLogin = window.confirm(
                "You must be logged in to compile or submit solutions and track your progress! Would you like to go to the login page now?"
            );
            if (confirmLogin) {
                navigate('/login');
            }
            return false; 
        }

        if (role === 'admin' && actionType === 'submit') {
            alert("⚠️ Submission Access Denied: Admin accounts cannot submit solutions to the live leaderboard to prevent scoring conflicts. Please use a regular Coder account to test submissions.");
            return false; 
        }

        return true; 
    };

    // Execution Handlers linked to State Machine
    const handleRunCode = () => {
        if (!checkAuth('run')) return;
        setIsSubmitTriggered(false); // Make sure it doesn't log into submission tab
        setIsConsoleOpen(true); 
        simulateExecution(userCode); 
    };

    const handleSubmitCode = async () => {
        if (!checkAuth('submit')) return;

        // Client-side rate-limit calculation (Max 5 submissions per 60 seconds)
        const now = Date.now();
        const recentSubmissions = submissionTimestamps.filter(time => now - time < 60000);

        if (recentSubmissions.length >= 5) {
            setShowRateLimitModal(true); // 🛑 Trigger aesthetic popup modal
            return;
        }

        // Record this valid submission timestamp
        setSubmissionTimestamps([...recentSubmissions, now]);

        try {
            setIsSubmitTriggered(true); 
            setIsConsoleOpen(true);
            simulateExecution(userCode);
        } catch (error) {
            console.error(error);
        }
    };

    // Navigation Handlers
    const handlePrev = () => { if (MOCK_PROBLEMS[currentId - 1]) navigate(`/problems/${currentId - 1}`); };
    const handleNext = () => { if (MOCK_PROBLEMS[currentId + 1]) navigate(`/problems/${currentId + 1}`); };
    const handlePickOne = () => {
        const keys = Object.keys(MOCK_PROBLEMS);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        navigate(`/problems/${randomKey}`);
    };

    return (
        <div className="workspace-layout" style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <header className="workspace-header">
                <div className="header-left">
                    <Link to="/" className="brand-logo-link">CodeArena</Link>
                    <span className="divider">|</span>
                    <button className="back-nav-btn" onClick={() => navigate('/problems')}>Problem List</button>
                    
                    <div className="nav-controls">
                        <button className="nav-arrow-btn" onClick={handlePrev} disabled={!MOCK_PROBLEMS[currentId - 1]}><FaChevronLeft size={11} /></button>
                        <button className="nav-arrow-btn" onClick={handleNext} disabled={!MOCK_PROBLEMS[currentId + 1]}><FaChevronRight size={11} /></button>
                        <button className="nav-arrow-btn pick-one" onClick={handlePickOne} title="Pick Random Problem"><FaRandom size={12} /></button>
                    </div>
                </div>
                
                <ActionButtons 
                    onRun={handleRunCode} 
                    onSubmit={handleSubmitCode} 
                    isLoading={currentState === 'COMPILING' || currentState === 'RUNNING_TESTS'}
                />
            </header>

            {!localStorage.getItem('token') && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    fontWeight: '500',
                    flexShrink: 0
                }}>
                    ⚠️ You are exploring this workspace as a guest. Please <Link to="/login" style={{ color: '#ef4444', fontWeight: '700', textDecoration: 'underline' }}>Sign In</Link> to save changes and execute code blocks.
                </div>
            )}

            {/* 🛑 Aesthetic Rate Limit Modal Popup */}
            {showRateLimitModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(234, 179, 8, 0.3)',
                        borderRadius: '12px',
                        padding: '30px',
                        width: '90%',
                        maxWidth: '420px',
                        textAlign: 'center',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
                        color: '#f8fafc'
                    }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(234, 179, 8, 0.15)',
                            color: '#eab308',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '0 auto 20px auto',
                            fontSize: '22px'
                        }}>
                            <FaExclamationTriangle />
                        </div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.25rem', fontWeight: '600', color: '#facc15' }}>
                            Submission Limit Reached
                        </h3>
                        <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.5' }}>
                            You have hit the maximum limit of <strong style={{ color: '#fff' }}>5 submissions per minute</strong>. Please take a moment to review your logic before submitting again.
                        </p>
                        <button 
                            onClick={() => setShowRateLimitModal(false)}
                            style={{
                                backgroundColor: '#eab308',
                                color: '#0f172a',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '10px 20px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                width: '100%',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#ca8a04'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#eab308'}
                        >
                            Got it, I'll wait
                        </button>
                    </div>
                </div>
            )}

            <div className="workspace-panels" style={{ position: 'relative', flex: 1, display: 'flex', overflow: 'hidden' }}>
                <ProblemDescription 
                    problem={problem} 
                    submissionHistory={submissionHistory} 
                />
                
                <div className="editor-side-container" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <CodeEditor 
                        selectedLang={selectedLang} 
                        setSelectedLang={setSelectedLang} 
                        onChange={(code) => setUserCode(code)} 
                    />

                    <ConsoleDrawer 
                        isOpen={isConsoleOpen}
                        onClose={() => setIsConsoleOpen(false)}
                        currentState={currentState}
                        currentTestIndex={currentTestIndex}
                        totalTestCases={totalTestCases}
                        feedback={feedback}
                    />
                </div>
            </div>
        </div>
    );
}

export default ProblemDetails;