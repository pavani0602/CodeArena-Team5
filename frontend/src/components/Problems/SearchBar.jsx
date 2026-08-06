import './SearchBar.css';
import { FaSearch } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

function SearchBar({ value, onChange }) {
    const { t } = useTranslation();
    return (
        <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
                type="text"
                placeholder={t('problems.searchPlaceholder')}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

export default SearchBar;