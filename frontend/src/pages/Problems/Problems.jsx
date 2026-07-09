import './Problems.css';
import { useState } from 'react';
import FilterBar from '../../components/Problems/FilterBar';
import SearchBar from '../../components/Problems/SearchBar';
import ProblemTable from '../../components/Problems/ProblemTable';
import ProblemModal from '../../components/Problems/ProblemModal';

function Problems() {
    const [searchQuery, setSearchQuery] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleProblemAdded = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <section className="problems-page">
            <div className="container">
                <div className="problems-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1>Problems</h1>
                        <p>
                            Practice coding challenges, improve your problem-solving skills,
                            and prepare for technical interviews.
                        </p>
                    </div>
                    <button
                        className="create-problem-btn"
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            background: 'var(--primary, #6366f1)',
                            color: '#fff',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                        }}
                    >
                        <span>+</span> Create Problem
                    </button>
                </div>
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                
                <FilterBar active={difficultyFilter} onChange={setDifficultyFilter} />
                
                <ProblemTable
                    searchQuery={searchQuery}
                    difficultyFilter={difficultyFilter}
                    refreshKey={refreshKey}
                />

                <ProblemModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onProblemAdded={handleProblemAdded}
                />
            </div>
        </section>
    );
}

export default Problems;