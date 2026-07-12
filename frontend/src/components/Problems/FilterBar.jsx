import './FilterBar.css';

const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

function FilterBar({ active, onChange }) {
    return (
        <div className="filter-bar-container">
            <div className="filter-group">
                <span className="filter-label">Difficulty:</span>
                <div className="difficulty-filters">
                    {difficulties.map((d) => (
                        <button
                            key={d}
                            className={`filter-btn ${d.toLowerCase()} ${active === d ? 'active' : ''}`}
                            onClick={() => onChange(d)}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FilterBar;