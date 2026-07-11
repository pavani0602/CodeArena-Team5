import { useState, Fragment } from 'react';
import './Admin.css';
import { FaPlus, FaTrash, FaSave, FaCode, FaCheckCircle, FaEdit, FaList } from 'react-icons/fa';

// Mock data representing problems already in your database
const MOCK_EXISTING_PROBLEMS = [
    {
        id: 101,
        title: 'Two Sum',
        difficulty: 'Easy',
        tags: 'Arrays, Hash Table',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        exampleInput: 'nums = [2,7,11,15], target = 9',
        exampleOutput: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
        testCases: [
            { id: 1, input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', isHidden: false },
            { id: 2, input: 'nums = [3,2,4], target = 6', output: '[1,2]', isHidden: true }
        ]
    },
    {
        id: 102,
        title: 'Container With Most Water',
        difficulty: 'Medium',
        tags: 'Arrays, Two Pointers',
        description: 'Find two lines that together with the x-axis forms a container, such that the container contains the most water.',
        exampleInput: 'height = [1,8,6,2,5,4,8,3,7]',
        exampleOutput: '49',
        explanation: 'The max area of water the container can contain is 49.',
        testCases: [
            { id: 3, input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', isHidden: false }
        ]
    }
];

function Admin() {
    const [activeTab, setActiveTab] = useState('create'); // 'create' or 'manage'
    const [editingProblemId, setEditingProblemId] = useState(null);

    // Form States
    const [problemData, setProblemData] = useState({
        title: '',
        difficulty: 'Easy',
        tags: '',
        description: '',
        exampleInput: '',
        exampleOutput: '',
        explanation: '',
    });

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

    // --- Load Problem into Form for Editing/Appending ---
    const handleEditClick = (prob) => {
        setEditingProblemId(prob.id);
        setProblemData({
            title: prob.title,
            difficulty: prob.difficulty,
            tags: prob.tags,
            description: prob.description,
            exampleInput: prob.exampleInput,
            exampleOutput: prob.exampleOutput,
            explanation: prob.explanation
        });
        setTestCases(prob.testCases);
        setActiveTab('create'); // Switch to form view
    };

    const handleCancelEdit = () => {
        setEditingProblemId(null);
        setProblemData({ title: '', difficulty: 'Easy', tags: '', description: '', exampleInput: '', exampleOutput: '', explanation: '' });
        setTestCases([{ id: Date.now(), input: '', output: '', isHidden: false }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const structuredPayload = {
            id: editingProblemId || Date.now(),
            ...problemData,
            tags: problemData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            testCases: testCases
        };

        if (editingProblemId) {
            console.log("Updating existing problem:", structuredPayload);
            alert(`Problem "${structuredPayload.title}" updated successfully with ${testCases.length} total test cases!`);
        } else {
            console.log("Saving new problem structure:", structuredPayload);
            alert(`Problem "${structuredPayload.title}" created successfully!`);
        }
        
        handleCancelEdit();
    };

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
                        onClick={() => { setActiveTab('manage'); handleCancelEdit(); }}
                    >
                        <FaList size={12} /> Manage Existing Problems ({MOCK_EXISTING_PROBLEMS.length})
                    </button>
                </div>
            </div>

            {activeTab === 'create' ? (
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
            ) : (
                /* --- MANAGE EXISTING PROBLEMS VIEW --- */
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
                                {MOCK_EXISTING_PROBLEMS.map((prob) => (
                                    <tr key={prob.id} className="admin-table-row">
                                        <td>#{prob.id}</td>
                                        <td className="prob-title-cell">{prob.title}</td>
                                        <td><span className={`badge ${prob.difficulty.toLowerCase()}`}>{prob.difficulty}</span></td>
                                        <td><span className="tc-count-badge">{prob.testCases.length} Loaded</span></td>
                                        <td className="actions-cell">
                                            <button className="edit-action-btn" onClick={() => handleEditClick(prob)}>
                                                <FaEdit size={12} /> Append Cases / Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;