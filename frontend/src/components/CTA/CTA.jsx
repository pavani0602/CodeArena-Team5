import "./CTA.css";
import { Link } from "react-router-dom";

function CTA() {
    return (
        <section className="cta">
            <div className="container">
                <div className="cta-content">
                    <h2>Ready to Start Your Coding Journey?</h2>
                    <p>
                        Join CodeArena today and sharpen your
                        problem-solving skills one challenge at a time
                    </p>
                    <Link className="cta-button" to="/register">
                        Get Started!
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default CTA;