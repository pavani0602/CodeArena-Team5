import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaRandom } from 'react-icons/fa';
import ProblemDescription from '../../components/ProblemDetails/ProblemDescription';
import CodeEditor from '../../components/ProblemDetails/CodeEditor';
import ActionButtons from '../../components/ProblemDetails/ActionButtons';
import ConsoleDrawer from '../../components/ProblemDetails/ConsoleDrawer'; 
import { useSubmissionStateMachine } from '../../hooks/useSubmissionStateMachine'; 
import { fetchApi } from '../../services/api';
import './ProblemDetails.css';


function ProblemDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const currentId = parseInt(id) || 1;
    
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProblemData = async () => {
            setLoading(true);
            try {
                // Fetch problem details
                const probRes = await fetchApi(`/api/problems/${currentId}`);
                if (!probRes.ok) throw new Error("Problem not found");
                const probData = await probRes.json();

                // Fetch test cases to attach to problem
                const tcRes = await fetchApi(`/api/testcases/problem/${currentId}`);
                const tcData = tcRes.ok ? await tcRes.json() : [];

                setProblem({
                    ...probData,
                    testCases: tcData
                });

                // Fetch real past submissions for this problem
                const subRes = await fetchApi(`/api/submissions/problem/${currentId}`);
                if (subRes.ok) {
                    const subData = await subRes.json();
                    const mappedSubmissions = subData.map(s => ({
                        status: s.status === 'ACCEPTED' ? 'Accepted' : (s.status === 'WRONG_ANSWER' ? 'Wrong Answer' : s.status),
                        language: s.language.charAt(0).toUpperCase() + s.language.slice(1).toLowerCase(),
                        runtime: s.results && s.results.length > 0 ? `${s.results[0].executionTimeMs} ms` : "N/A",
                        timeSubmitted: new Date(s.submittedAt).toLocaleString()
                    })).sort((a, b) => new Date(b.timeSubmitted) - new Date(a.timeSubmitted));
                    
                    setSubmissionHistory(mappedSubmissions);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load problem details.");
            } finally {
                setLoading(false);
            }
        };
        
        loadProblemData();
    }, [currentId]);

    // Lifted States
    const [selectedLang, setSelectedLang] = useState('python');
    const [userCode, setUserCode] = useState(''); 
    const [isConsoleOpen, setIsConsoleOpen] = useState(false); 
    
    // Dynamic array tracker to manage solution submission history profiles
    const [submissionHistory, setSubmissionHistory] = useState([]);
    const [isSubmitTriggered, setIsSubmitTriggered] = useState(false);

    // Automatically update code editor starter text when switching problems
    useEffect(() => {
        if (problem?.starterCode) {
            setUserCode(problem.starterCode);
        }
    }, [currentId, problem]);

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
            const newSubmission = {
                status: feedback?.status || (currentState === 'SUCCESS' ? 'Accepted' : 'Wrong Answer'),
                language: selectedLang.charAt(0).toUpperCase() + selectedLang.slice(1),
                runtime: feedback?.runtime || "N/A",
                timeSubmitted: "Just now"
            };

            // Prepend new record directly into history state container
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
        simulateExecution(userCode, selectedLang, false); 
    };

    const handleSubmitCode = () => {
        if (!checkAuth('submit')) return;
        setIsSubmitTriggered(true); // Flag this execution run as a true profile submission
        setIsConsoleOpen(true);
        simulateExecution(userCode, selectedLang, true);
    };

    // Navigation Handlers - Optimistically navigate to adjacent IDs
    const handlePrev = () => { if (currentId > 1) navigate(`/problems/${currentId - 1}`); };
    const handleNext = () => { navigate(`/problems/${currentId + 1}`); };
    const handlePickOne = () => {
        // Pick a random ID between 1 and 10 for demo purposes since we don't have total count here
        const randomKey = Math.floor(Math.random() * 10) + 1;
        navigate(`/problems/${randomKey}`);
    };

    if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',color:'white'}}>Loading Problem Data...</div>;
    if (error || !problem) return <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',height:'100vh',color:'red'}}>
        <h2>{error || "Problem Not Found"}</h2>
        <button onClick={() => navigate('/problems')} style={{marginTop: '20px', padding: '10px 20px'}}>Back to Problem List</button>
    </div>;

    return (
        <div className="workspace-layout" style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <header className="workspace-header">
                <div className="header-left">
                    <Link to="/" className="brand-logo-link">CodeArena</Link>
                    <span className="divider">|</span>
                    <button className="back-nav-btn" onClick={() => navigate('/problems')}>Problem List</button>
                    
                    <div className="nav-controls">
                        <button className="nav-arrow-btn" onClick={handlePrev} disabled={currentId <= 1}><FaChevronLeft size={11} /></button>
                        <button className="nav-arrow-btn" onClick={handleNext}><FaChevronRight size={11} /></button>
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

            <div className="workspace-panels" style={{ position: 'relative', flex: 1, display: 'flex', overflow: 'hidden' }}>
                
                {/* Pass our newly created submissionHistory array down as a prop */}
                <ProblemDescription 
                    problem={problem} 
                    submissionHistory={submissionHistory} 
                />
                
                <div className="editor-side-container" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <CodeEditor 
                        selectedLang={selectedLang} 
                        setSelectedLang={setSelectedLang} 
                        value={userCode} 
                        onChange={(code) => setUserCode(code)} 
                        problemTitle={problem.title}
                        compileError={feedback?.isError ? { line: feedback.errorLine, message: feedback.message } : null}
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