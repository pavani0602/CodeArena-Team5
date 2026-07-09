import './FilterBar.css';
function FilterBar() {
    return (
        <div className="filter-bar">

            <div className="difficulty-filters">
                <button className="active">All</button>
                <button>Easy</button>
                <button>Medium</button>
                <button>Hard</button>
            </div>

            <div className="sort-filter">
                <select>
                    <option>Latest</option>
                    <option>Difficulty</option>
                    <option>Name</option>
                </select>
            </div>

        </div>
    );
}

export default FilterBar;