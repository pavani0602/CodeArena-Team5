import './FilterBar.css';
import { FaFilter, FaSortAmountDown } from 'react-icons/fa';

function FilterBar({ selected, onSelect, sortBy, onSortChange }) {
    const difficulties = ["All", "Easy", "Medium", "Hard"];

    return (
        <div className="filter-bar-container">
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
                    {/* Add value and onChange to make it dynamic */}
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
    );
}

export default FilterBar;