import './FilterBar.css';
import { FaFilter, FaSortAmountDown } from 'react-icons/fa';

function FilterBar({ selected, onSelect, selectedTopic, onTopicSelect, sortBy, onSortChange }) {
    const difficulties = ["All", "Easy", "Medium", "Hard"];
    
    const topics = [
        "All", "Array", "String", "Stack", "Tree", 
        "Graph", "Dynamic Programming", "Sorting", 
        "Binary Search", "Design", "Two Pointers", 
        "Sliding Window", "Hash Table", "Heap", "Greedy"
    ];

    return (
        <div className="filter-bar-container">
            <div className="filter-top-row">
                <div className="filter-group">
                    <span className="filter-label">
                        <FaFilter className="icon" /> Filter by:
                    </span>
                    <div className="difficulty-filters">
                        {difficulties.map((diff) => (
                            <button 
                                key={diff}
                                className={`filter-btn ${diff.toLowerCase()} ${selected === diff ? "active" : ""}`}
                                onClick={() => onSelect(diff)}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="sort-group">
                    <span className="filter-label">
                        <FaSortAmountDown className="icon" /> Sort by:
                    </span>
                    <div className="sort-select-wrapper">
                        <select 
                            className="sort-select" 
                            value={sortBy} 
                            onChange={(e) => onSortChange(e.target.value)}
                        >
                            <option value="latest">Latest Added</option>
                            <option value="difficulty">Difficulty Level</option>
                            <option value="name">Alphabetical (A-Z)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Topic Tags Wrapping Rows */}
            <div className="topic-filter-row">
                {topics.map((topic) => {
                    const isSelected = selectedTopic === topic;
                    return (
                        <button
                            key={topic}
                            onClick={() => onTopicSelect(topic)}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '16px',
                                border: isSelected ? '1px solid #3b82f6' : '1px solid #374151',
                                background: isSelected ? '#2563eb' : '#1f2937',
                                color: isSelected ? '#ffffff' : '#9ca3af',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                fontSize: '12px',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            {topic}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default FilterBar;