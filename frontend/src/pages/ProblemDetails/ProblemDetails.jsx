import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaRandom } from 'react-icons/fa';
import ProblemDescription from '../../components/ProblemDetails/ProblemDescription';
import CodeEditor from '../../components/ProblemDetails/CodeEditor';
import ActionButtons from '../../components/ProblemDetails/ActionButtons';
import ConsoleDrawer from '../../components/ProblemDetails/ConsoleDrawer'; // 1. Import ConsoleDrawer Component
import { useSubmissionStateMachine } from '../../hooks/useSubmissionStateMachine'; // 2. Import the State Hook
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
        testCases: [{ expectedOutput: "[0,1]" }, { expectedOutput: "[1,2]" }] // Added basic array structure for the simulation loop
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
    const [userCode, setUserCode] = useState(''); // 3. State to capture the actual code text from CodeEditor
    const [isConsoleOpen, setIsConsoleOpen] = useState(false); // 4. Controls drawer opening/closing

    // 5. Initialize State Machine Hook
    const {
        currentState,
        currentTestIndex,
        feedback,
        simulateExecution,
        totalTestCases
    } = useSubmissionStateMachine(problem);

    // 🛡️ Guard checks
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

    // 6. Execution Handlers linked to State Machine
    const handleRunCode = () => {
        if (!checkAuth('run')) return;
        setIsConsoleOpen(true); // Open console panel view immediately
        simulateExecution(userCode); // Run execution sequence
    };

    const handleSubmitCode = () => {
        if (!checkAuth('submit')) return;
        setIsConsoleOpen(true);
        simulateExecution(userCode);
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
                
                {/* Disabled while actively evaluating code to prevent script conflicts */}
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

            {/* Main panels view row */}
            <div className="workspace-panels" style={{ position: 'relative', flex: 1, display: 'flex', overflow: 'hidden' }}>
                
                {/* Left Column Component: Stays cleanly isolated on the left half */}
                <ProblemDescription problem={problem} />
                
                {/* Right Column Container: Strictly houses the code layout and terminal overlay */}
                <div className="editor-side-container" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    
                    {/* 7. Pass setter to tracking changes inside custom CodeEditor wrapper component */}
                    <CodeEditor 
                        selectedLang={selectedLang} 
                        setSelectedLang={setSelectedLang} 
                        onChange={(code) => setUserCode(code)} 
                    />

                    {/* 8. Slide-Up Drawer layer restricted exactly to the code view layout container width */}
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