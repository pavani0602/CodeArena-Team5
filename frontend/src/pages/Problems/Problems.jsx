import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Problems.css';
import FilterBar from '../../components/problems/FilterBar';
import SearchBar from '../../components/Problems/SearchBar';
import ProblemTable from '../../components/Problems/ProblemTable';

function Problems() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("All");
    const [sortBy, setSortBy] = useState("latest"); // 1. Add sorting state

    const handleProblemSelect = (id) => {
        navigate(`/problems/${id}`);
    };

    return (
        <section className="problems-page">
            <div className="container">
                <div className="problems-header">
                    <h1>Problems</h1>
                    <p>
                        Practice coding challenges, improve your problem-solving skills,
                        and prepare for technical interviews.
                    </p>
                </div>
                
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                
                {/* 2. Pass sortBy and setSortBy here */}
                <FilterBar 
                    selected={selectedDifficulty} 
                    onSelect={setSelectedDifficulty} 
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />
                
                {/* 3. Pass sortBy down to the table so it can rearrange rows */}
                <ProblemTable 
                    searchQuery={searchQuery} 
                    difficulty={selectedDifficulty} 
                    sortBy={sortBy}
                    onRowClick={handleProblemSelect} 
                />
            </div>
        </section>
    );
}

export default Problems;