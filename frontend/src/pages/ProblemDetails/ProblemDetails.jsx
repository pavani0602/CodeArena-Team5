import "./ProblemDetails.css";
import { Link, useParams } from "react-router-dom"; // 1. Import useParams
import { FaArrowLeft } from "react-icons/fa";

import ProblemDescription from "../../components/ProblemDetails/ProblemDescription";
import CodeEditor from "../../components/ProblemDetails/CodeEditor";
import ActionButtons from "../../components/ProblemDetails/ActionButtons";

function ProblemDetails() {
    // 2. Extract the dynamic ID from the URL link
    const { id } = useParams();

    return (
        <section className="problem-details-page">
            <div className="container">

                <Link to="/problems" className="back-link">
                    <FaArrowLeft />
                    Back to Problems
                </Link>

                <div className="problem-layout">

                    <div className="left-panel">
                        {/* 3. Pass the id down to the description component */}
                        <ProblemDescription problemId={id} />
                    </div>

                    <div className="right-panel">
                        {/* 4. Pass it to the editor and buttons too for later use */}
                        <CodeEditor problemId={id} />
                        <ActionButtons problemId={id} />
                    </div>

                </div>
            </div>
        </section>
    );
}

export default ProblemDetails;