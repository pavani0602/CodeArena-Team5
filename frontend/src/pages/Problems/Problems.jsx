import './Problems.css';
import { useState } from 'react';
import FilterBar from '../../components/Problems/FilterBar';
import SearchBar from '../../components/Problems/SearchBar';
import ProblemTable from '../../components/Problems/ProblemTable';

function Problems() {
    const [searchQuery, setSearchQuery] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('All');

    return (
        <section className="problems-page">
            <div className="container">
                <div className="problems-header">
                    <h1>
                        Problems
                    </h1>
                    <p>
                        Practice coding challenges, improve your problem-solving skills,
                        and prepare for technical interviews.
                    </p>
                </div>
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                
                <FilterBar active={difficultyFilter} onChange={setDifficultyFilter} />
                
                <ProblemTable searchQuery={searchQuery} difficultyFilter={difficultyFilter} />
            </div>
        </section>
    )
}

export default Problems;