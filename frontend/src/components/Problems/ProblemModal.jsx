import { useState } from 'react';
import './ProblemModal.css';

function ProblemModal({ isOpen, onClose, onProblemAdded }) {
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState('EASY');
    const [tags, setTags] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            setError('Please provide both a title and a description.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('jwtToken');
            const res = await fetch('/api/problems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    title: title.trim(),
                    difficulty,
                    tags: tags.trim(),
                    description: description.trim()
                })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to create problem');
            }

            const newProblem = await res.json();
            onProblemAdded(newProblem);
            setTitle('');
            setDescription('');
            setTags('');
            setDifficulty('EASY');
            onClose();
        } catch (err) {
            setError(err.message || 'An error occurred while creating the problem.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Problem</h2>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>

                {error && <div className="modal-error">{error}</div>}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Problem Title *</label>
                        <input
                            type="text"
                            placeholder="e.g. Reverse Integer"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Difficulty *</label>
                            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Tags (comma separated)</label>
                            <input
                                type="text"
                                placeholder="e.g. Math, Two Pointers"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Problem Description (Markdown supported) *</label>
                        <textarea
                            rows="6"
                            placeholder="### Problem Statement&#10;Describe the problem clearly..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Problem'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProblemModal;
