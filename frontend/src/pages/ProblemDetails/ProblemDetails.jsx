const MOCK_PROBLEMS = {
    1: {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        tags: ["Array", "Hash Table"],
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.",
        exampleInput: "nums = [2,7,11,15], target = 9",
        exampleOutput: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    },
    2: {
        id: 2,
        title: "Valid Parentheses",
        difficulty: "Easy",
        tags: ["String", "Stack"],
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets.",
        exampleInput: 's = "()[]{}"',
        exampleOutput: "true",
        explanation: "All brackets are closed sequentially in correct matching pairs."
    },
    3: {
        id: 3,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        tags: ["Hash Table", "String", "Sliding Window"],
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        exampleInput: 's = "abcabcbb"',
        exampleOutput: "3",
        explanation: "The answer is \"abc\", with the length of 3."
    }
};
import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaRandom } from 'react-icons/fa';
import ProblemDescription from '../../components/ProblemDetails/ProblemDescription';
import CodeEditor from '../../components/ProblemDetails/CodeEditor';
import ActionButtons from '../../components/ProblemDetails/ActionButtons';
import './ProblemDetails.css';

// ... Keep your MOCK_PROBLEMS object here ...

function ProblemDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const currentId = parseInt(id) || 1;
    const problem = MOCK_PROBLEMS[currentId] || MOCK_PROBLEMS[1];

    // Lifted State: Manage language here so ActionButtons can read it
    const [selectedLang, setSelectedLang] = useState('python');

    // 🛡️ Updated Guard: Checks for both login status and admin restrictions
    const checkAuth = (actionType) => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        
        // 1. Guest Check
        if (!token) {
            const confirmLogin = window.confirm(
                "You must be logged in to compile or submit solutions and track your progress! Would you like to go to the login page now?"
            );
            if (confirmLogin) {
                navigate('/login');
            }
            return false; 
        }

        // 2. Admin Leaderboard Protection Guard
        if (role === 'admin' && actionType === 'submit') {
            alert("⚠️ Submission Access Denied: Admin accounts cannot submit solutions to the live leaderboard to prevent scoring conflicts. Please use a regular Coder account to test submissions.");
            return false; // 🛑 Block the submission completely
        }

        return true; // Safe to proceed
    };

    // Execution Handlers passing the action type
    const handleRunCode = () => {
        if (!checkAuth('run')) return; // Admins AND Coders are allowed to run test cases

        alert(`Running solution for "${problem.title}" using ${selectedLang.toUpperCase()}...`);
        // Future: Add your API call here to compile code against sample test cases
    };

    const handleSubmitCode = () => {
        if (!checkAuth('submit')) return; // Admins will get blocked here!

        alert(`Submitting solution for "${problem.title}" using ${selectedLang.toUpperCase()}! Checking all test cases...`);
        // Future: Add your API call here to submit code to backend evaluation engine
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
        <div className="workspace-layout">
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
                
                <ActionButtons onRun={handleRunCode} onSubmit={handleSubmitCode} />
            </header>

            {/* 💡 Guest Notification Banner directly above the split panel workspaces */}
            {!localStorage.getItem('token') && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    fontWeight: '500'
                }}>
                    ⚠️ You are exploring this workspace as a guest. Please <Link to="/login" style={{ color: '#ef4444', fontWeight: '700', textDecoration: 'underline' }}>Sign In</Link> to save changes and execute code blocks.
                </div>
            )}

            <div className="workspace-panels">
                <ProblemDescription problem={problem} />
                <CodeEditor selectedLang={selectedLang} setSelectedLang={setSelectedLang} />
            </div>
        </div>
    );
}

export default ProblemDetails;