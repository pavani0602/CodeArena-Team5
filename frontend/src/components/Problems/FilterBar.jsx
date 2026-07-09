import './FilterBar.css';

const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

function FilterBar({ active, onChange }) {
    return (
        <div className="filter-bar">

            <div className="difficulty-filters">
                {difficulties.map((d) => (
                    <button
                        key={d}
                        className={active === d ? 'active' : ''}
                        onClick={() => onChange(d)}
                    >
                        {d}
                    </button>
                ))}
            </div>

        </div>
    );
}

export default FilterBar;