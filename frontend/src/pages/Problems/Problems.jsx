import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Problems.css';
import FilterBar from '../../components/Problems/FilterBar';
import SearchBar from '../../components/Problems/SearchBar';
import ProblemTable from '../../components/Problems/ProblemTable';

function Problems() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("All");
    const [selectedTopic, setSelectedTopic] = useState("All"); // 👈 1. Added topic state
    const [sortBy, setSortBy] = useState("latest");
    
    // Check if the current user is an admin
    const userRole = localStorage.getItem('userRole');

    const handleProblemSelect = (id) => {
        navigate(`/problems/${id}`);
    };

    return (
        <section className="problems-page">
            <div className="container">
                <div className="problems-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Problems</h1>
                        <p>
                            Practice coding challenges, improve your problem-solving skills,
                            and prepare for technical interviews.
                        </p>
                    </div>

                    {/* 🚀 Admin Quick Add Button */}
                    {userRole === 'admin' && (
                        <button 
                            className="admin-quick-add-btn"
                            onClick={() => navigate('/admin')}
                            style={{
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            + Add Problem
                        </button>
                    )}
                </div>
                
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                
                <FilterBar 
                    selected={selectedDifficulty} 
                    onSelect={setSelectedDifficulty} 
                    selectedTopic={selectedTopic}     
                    onTopicSelect={setSelectedTopic}    
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />
                
                <ProblemTable 
                    searchQuery={searchQuery} 
                    difficulty={selectedDifficulty} 
                    selectedTopic={selectedTopic}         
                    sortBy={sortBy}
                    onRowClick={handleProblemSelect} 
                />
            </div>
        </section>
    );
}

export default Problems;