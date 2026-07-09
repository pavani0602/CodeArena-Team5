import './SearchBar.css';
import { FaSearch } from "react-icons/fa";

function SearchBar() {
    return (
        <div className="search-bar">

            <FaSearch className="search-icon" />

            <input
                type="text"
                placeholder="Search problems..."
            />

        </div>
    );
}

export default SearchBar;