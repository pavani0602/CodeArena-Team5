import "./ProblemDetails.css";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import ProblemDescription from "../../components/ProblemDetails/ProblemDescription";
import CodeEditor from "../../components/ProblemDetails/CodeEditor";
import ActionButtons from "../../components/ProblemDetails/ActionButtons";

function ProblemDetails() {
    return (
        <section className="problem-details-page">

            <div className="container">

                <Link to="/problems" className="back-link">
                    <FaArrowLeft />
                    Back to Problems
                </Link>

                <div className="problem-layout">

                    <div className="left-panel">
                        <ProblemDescription />
                    </div>

                    <div className="right-panel">
                        <CodeEditor />
                        <ActionButtons />
                    </div>

                </div>

            </div>

        </section>
    );
}

export default ProblemDetails;