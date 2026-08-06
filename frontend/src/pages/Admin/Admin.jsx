import { useState, useEffect, Fragment } from 'react';
import './Admin.css';
import { FaPlus, FaTrash, FaSave, FaCode, FaCheckCircle, FaEdit, FaList } from 'react-icons/fa';
import { fetchApi } from '../../services/api';

function Admin() {
    const [existingProblems, setExistingProblems] = useState([]);
    const [activeTab, setActiveTab] = useState('create'); // 'create', 'manage', or 'activity'
    const [editingProblemId, setEditingProblemId] = useState(null);
    const [allSubmissions, setAllSubmissions] = useState([]);

    // Form States
    const [problemData, setProblemData] = useState({
        title: '',
        difficulty: 'Easy',
        description: '',
        editorialMd: '',
        exampleInput: '',
        exampleOutput: '',
        explanation: '',
        functionName: 'solve',
        parameterNames: 'input',
        parameterTypes: 'string',
        returnType: 'string'
    });

    const [hints, setHints] = useState(['']);

    const [testCases, setTestCases] = useState([
        { id: 1, input: '', output: '', isHidden: false }
    ]);

    const handleFormChange = (e) => {
        setProblemData({ ...problemData, [e.target.name]: e.target.value });
    };

    // --- Dynamic Test Case Management Engine ---
    const handleTestCaseChange = (id, field, value) => {
        setTestCases(prev => prev.map(tc => 
            tc.id === id ? { ...tc, [field]: value } : tc
        ));
    };

    const addTestCase = () => {
        setTestCases([...testCases, { id: Date.now(), input: '', output: '', isHidden: false }]);
    };

    const removeTestCase = (id) => {
        if (testCases.length === 1) return;
        setTestCases(testCases.filter(tc => tc.id !== id));
    };

    // --- Dynamic Hints Management ---
    const handleHintChange = (index, value) => {
        const newHints = [...hints];
        newHints[index] = value;
        setHints(newHints);
    };

    const addHint = () => {
        setHints([...hints, '']);
    };

    const removeHint = (index) => {
        if (hints.length === 1) return;
        setHints(hints.filter((_, i) => i !== index));
    };

    // --- Load Problem into Form for Editing/Appending ---
    const handleEditClick = (prob) => {
        setEditingProblemId(prob.id);
        setProblemData({
            title: prob.title,
            difficulty: prob.difficulty,
            tags: prob.tags || '',
            description: prob.description,
            editorialMd: prob.editorialMd || '',
            exampleInput: '',
            exampleOutput: '',
            explanation: '',
            functionName: prob.functionName || 'solve',
            parameterNames: prob.parameterNames || 'input',
            parameterTypes: prob.parameterTypes || 'string',
            returnType: prob.returnType || 'string'
        });
        
        if (prob.hints && prob.hints.length > 0) {
            setHints(prob.hints.sort((a, b) => a.hintNumber - b.hintNumber).map(h => h.hintText));
        } else {
            setHints(['']);
        }
        
        fetchApi(`/api/testcases/problem/${prob.id}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load test cases");
                return res.json();
            })
            .then(tcs => {
                if (tcs && tcs.length > 0) {
                    setTestCases(tcs.map(tc => ({ id: tc.id, input: tc.inputData, output: tc.expectedOutput, isHidden: tc.hidden })));
                } else {
                    setTestCases([{ id: Date.now(), input: '', output: '', isHidden: false }]);
                }
            })
            .catch(err => {
                console.error("Error loading test cases:", err);
                setTestCases([{ id: Date.now(), input: '', output: '', isHidden: false }]);
            });
            
        setActiveTab('create'); // Switch to form view
    };

    const handleCancelEdit = () => {
        setEditingProblemId(null);
        setProblemData({ title: '', difficulty: 'Easy', tags: '', description: '', editorialMd: '', exampleInput: '', exampleOutput: '', explanation: '', functionName: 'solve', parameterNames: 'input', parameterTypes: 'string', returnType: 'string' });
        setTestCases([{ id: Date.now(), input: '', output: '', isHidden: false }]);
        setHints(['']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Build Markdown description (only append if creating new)
        let finalDesc = problemData.description;
        if (!editingProblemId && problemData.exampleInput) {
            finalDesc = `${problemData.description}

### Example
**Input:** ${problemData.exampleInput}
**Output:** ${problemData.exampleOutput}

**Explanation:** ${problemData.explanation}`;
        }

        const payload = {
            title: problemData.title,
            difficulty: problemData.difficulty.toUpperCase(),
            tags: problemData.tags,
            description: finalDesc,
            editorialMd: problemData.editorialMd,
            hints: hints.filter(h => h.trim() !== ''),
            functionName: problemData.functionName,
            parameterNames: problemData.parameterNames,
            parameterTypes: problemData.parameterTypes,
            returnType: problemData.returnType
        };

        try {
            let probId = editingProblemId;
            let actionName = "created";
            
            if (editingProblemId) {
                // Update existing Problem
                const probRes = await fetchApi(`/api/problems/${editingProblemId}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
                if (!probRes.ok) throw new Error("Failed to update problem");
                
                // Clear old test cases
                await fetchApi(`/api/testcases/problem/${editingProblemId}`, {
                    method: 'DELETE'
                });
                actionName = "updated";
            } else {
                // Create new Problem
                const probRes = await fetchApi('/api/problems', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                if (!probRes.ok) throw new Error("Failed to create problem");
                const newProb = await probRes.json();
                probId = newProb.id;
            }

            // Create TestCases
            for (const tc of testCases) {
                await fetchApi(`/api/testcases/problem/${probId}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        inputData: tc.input,
                        expectedOutput: tc.output,
                        hidden: tc.isHidden
                    })
                });
            }

            alert(`Problem "${payload.title}" ${actionName} successfully with ${testCases.length} test cases!`);
            handleCancelEdit();
            fetchProblems();
        } catch (err) {
            console.error(err);
            alert("Error creating problem!");
        }
    };

    const fetchProblems = async () => {
        try {
            const res = await fetchApi('/api/problems');
            if (res.ok) {
                const data = await res.json();
                setExistingProblems(data);
            }
        } catch(e) { console.error(e); }
    };

    const fetchSubmissions = async () => {
        try {
            const res = await fetchApi('/api/admin/submissions');
            if (res.ok) {
                const data = await res.json();
                setAllSubmissions(data);
            }
        } catch(e) { console.error(e); }
    };

    useEffect(() => { 
        fetchProblems(); 
        if (activeTab === 'activity') {
            fetchSubmissions();
        }
    }, [activeTab]);

    return (
        <div className="admin-dashboard-container animate-fade-in">
            <div className="admin-page-header">
                <h2>Admin Workspace</h2>
                <p>Manage algorithmic challenges, append test matrices, or build brand new problems.</p>
                
                {/* Admin Sub-navigation Tabs */}
                <div className="admin-tabs">
                    <button 
                        className={`admin-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => setActiveTab('create')}
                    >
                        <FaPlus size={12} /> {editingProblemId ? 'Editing Problem' : 'Create Problem'}
                    </button>
                    <button 
                        className={`admin-tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('manage'); handleCancelEdit(); fetchProblems(); }}
                    >
                        <FaList size={12} /> Manage Existing Problems ({existingProblems.length})
                    </button>
                    <button 
                        className={`admin-tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('activity'); handleCancelEdit(); fetchSubmissions(); }}
                    >
                        <FaCode size={12} /> View User Submissions
                    </button>
                </div>
            </div>

            {activeTab === 'create' && (
                <form onSubmit={handleSubmit} className="admin-problem-form">
                    {editingProblemId && (
                        <div className="editing-banner">
                            <span>You are currently editing <strong>{problemData.title}</strong></span>
                            <button type="button" className="cancel-edit-btn" onClick={handleCancelEdit}>Cancel & Clear</button>
                        </div>
                    )}
                    
                    <div className="admin-grid-layout">
                        {/* Left Column: Specifications */}
                        <div className="admin-panel-card">
                            <div className="card-header-accent">
                                <FaCode /> <span>Problem Specifications</span>
                            </div>
                            
                            <div className="form-group">
                                <label>Problem Title</label>
                                <input type="text" name="title" required value={problemData.title} onChange={handleFormChange} placeholder="e.g., Two Sum" />
                            </div>

                            <div className="form-row-split">
                                <div className="form-group">
                                    <label>Function Name</label>
                                    <input type="text" name="functionName" required value={problemData.functionName} onChange={handleFormChange} placeholder="twoSum" />
                                </div>
                                <div className="form-group">
                                    <label>Return Type</label>
                                    <input type="text" name="returnType" required value={problemData.returnType} onChange={handleFormChange} placeholder="int[]" />
                                </div>
                            </div>
                            
                            <div className="form-row-split">
                                <div className="form-group">
                                    <label>Param Names <span className="label-tip">(Comma-separated)</span></label>
                                    <input type="text" name="parameterNames" required value={problemData.parameterNames} onChange={handleFormChange} placeholder="nums,target" />
                                </div>
                                <div className="form-group">
                                    <label>Param Types <span className="label-tip">(Comma-separated)</span></label>
                                    <input type="text" name="parameterTypes" required value={problemData.parameterTypes} onChange={handleFormChange} placeholder="int[],int" />
                                </div>
                            </div>

                            <div className="form-row-split">
                                <div className="form-group">
                                    <label>Difficulty</label>
                                    <select name="difficulty" value={problemData.difficulty} onChange={handleFormChange}>
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Tags <span className="label-tip">(Comma-separated)</span></label>
                                    <input type="text" name="tags" value={problemData.tags} onChange={handleFormChange} placeholder="Arrays, Hash Table" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Problem Description</label>
                                <textarea name="description" required rows="5" value={problemData.description} onChange={handleFormChange} placeholder="Describe the constraints..." />
                            </div>

                            <div className="form-row-split">
                                <div className="form-group">
                                    <label>Example Input</label>
                                    <input type="text" name="exampleInput" value={problemData.exampleInput} onChange={handleFormChange} placeholder="nums = [2,7], target = 9" />
                                </div>
                                <div className="form-group">
                                    <label>Example Output</label>
                                    <input type="text" name="exampleOutput" value={problemData.exampleOutput} onChange={handleFormChange} placeholder="[0,1]" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Example Explanation</label>
                                <textarea name="explanation" rows="2" value={problemData.explanation} onChange={handleFormChange} placeholder="Explanation..." />
                            </div>

                            <div className="form-group">
                                <label>Problem Editorial (Markdown)</label>
                                <textarea name="editorialMd" rows="5" value={problemData.editorialMd} onChange={handleFormChange} placeholder="Write the editorial approach..." />
                            </div>

                            <div className="form-group">
                                <div className="flex-align-center justify-between" style={{ marginBottom: '8px' }}>
                                    <label style={{ margin: 0 }}>Hints</label>
                                    <button type="button" className="add-testcase-btn" onClick={addHint}>
                                        <FaPlus size={10} /> Add Hint
                                    </button>
                                </div>
                                {hints.map((hint, index) => (
                                    <div key={index} className="flex-align-center gap-8" style={{ marginBottom: '8px' }}>
                                        <input 
                                            type="text" 
                                            value={hint} 
                                            onChange={(e) => handleHintChange(index, e.target.value)} 
                                            placeholder={`Hint ${index + 1}...`} 
                                            style={{ flex: 1 }}
                                        />
                                        <button 
                                            type="button" 
                                            className="delete-testcase-btn" 
                                            onClick={() => removeHint(index)}
                                            disabled={hints.length === 1}
                                        >
                                            <FaTrash size={11} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Engine Validation Test Cases */}
                        <div className="admin-panel-card">
                            <div className="card-header-accent justify-between">
                                <div className="flex-align-center gap-8">
                                    <FaCheckCircle /> <span>Test Case Validation Matrix</span>
                                </div>
                                <button type="button" className="add-testcase-btn" onClick={addTestCase}>
                                    <FaPlus size={10} /> Add Case
                                </button>
                            </div>
                            
                            <p className="panel-helper-text">Add multiple dynamic cases. Checked items remain hidden from users to prevent hardcoding submissions.</p>

                            <div className="testcase-scroller-box">
                                {testCases.map((tc, index) => (
                                    <div key={tc.id} className="testcase-row-card">
                                        <div className="testcase-badge-index">Case #{index + 1}</div>
                                        
                                        <div className="testcase-inputs-grid">
                                            <div className="form-group">
                                                <input type="text" required placeholder="Raw Input string" value={tc.input} onChange={(e) => handleTestCaseChange(tc.id, 'input', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <input type="text" required placeholder="Expected Output" value={tc.output} onChange={(e) => handleTestCaseChange(tc.id, 'output', e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="testcase-actions-row">
                                            <label className="checkbox-container">
                                                <input type="checkbox" checked={tc.isHidden} onChange={(e) => handleTestCaseChange(tc.id, 'isHidden', e.target.checked)} />
                                                <span className="checkbox-label">Hidden Test Case</span>
                                            </label>
                                            
                                            <button type="button" className="delete-testcase-btn" disabled={testCases.length === 1} onClick={() => removeTestCase(tc.id)}>
                                                <FaTrash size={11} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button type="submit" className="save-problem-submit">
                                <FaSave /> {editingProblemId ? 'Update & Save Changes' : 'Create Code Arena Problem'}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {activeTab === 'manage' && (
                <div className="admin-panel-card animate-fade-in">
                    <div className="card-header-accent">
                        <FaList /> <span>Repository Problem Index</span>
                    </div>
                    <div className="admin-table-wrapper">
                        <table className="admin-problems-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Problem Name</th>
                                    <th>Difficulty</th>
                                    <th>Test Cases</th>
                                    {/* <th style={{ textAlignment: 'right' }}>Actions</th> */}
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {existingProblems.map((prob) => (
                                    <tr key={prob.id} className="admin-table-row">
                                        <td>#{prob.id}</td>
                                        <td className="prob-title-cell">{prob.title}</td>
                                        <td><span className={`badge ${prob.difficulty.toLowerCase()}`}>{prob.difficulty}</span></td>
                                        <td><span className="tc-count-badge">Loaded</span></td>
                                        <td className="actions-cell">
                                            <button className="edit-action-btn" onClick={() => handleEditClick(prob)}>
                                                <FaEdit size={12} /> Edit Problem
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'activity' && (
                /* --- VIEW USER SUBMISSIONS VIEW --- */
                <div className="admin-panel-card animate-fade-in">
                    <div className="card-header-accent">
                        <FaCode /> <span>Global User Activity & Submissions</span>
                    </div>
                    <div className="admin-table-wrapper">
                        <table className="admin-problems-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Problem Solved</th>
                                    <th>Language</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allSubmissions.map((sub) => (
                                    <tr key={sub.submissionId} className="admin-table-row">
                                        <td className="prob-title-cell">{sub.username}</td>
                                        <td>{sub.email}</td>
                                        <td className="prob-title-cell">{sub.problemTitle}</td>
                                        <td><span className="badge">{sub.language}</span></td>
                                        <td><span className={`badge ${sub.status === 'ACCEPTED' ? 'easy' : 'hard'}`}>{sub.status}</span></td>
                                        <td style={{ textAlign: 'right' }}>{new Date(sub.submittedAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {allSubmissions.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No submissions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;