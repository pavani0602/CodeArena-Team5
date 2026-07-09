import './Problems.css';
import FilterBar from '../../components/problems/FilterBar';
import SearchBar from '../../components/Problems/SearchBar';
import ProblemTable from '../../components/Problems/ProblemTable';

function Problems() {
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
                <SearchBar />
                
                <FilterBar />
                
                <ProblemTable />
            </div>
        </section>
    )
}

export default Problems;