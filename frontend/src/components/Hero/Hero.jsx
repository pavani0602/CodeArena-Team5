import "./Hero.css";
import { Link } from "react-router-dom";

function Hero() {
    return (
        <section className="hero">
        <div className="container">
            <div className="hero-left">
                <h1>
                    Master Coding. <br />
                    <span className="brand-text">One Problem at a Time.</span>
                </h1>
                <p>
                    Practice data structures and algorithms, solve coding challenges, track your progress, and climb the leaderboard—all in one place.
                </p>
                <div className="hero-buttons">
                    <Link to="/problems">
                        <button className="primary-butt">Start Solving</button>
                    </Link>
                    {/* <Link to="/leaderboard">
                        <button className="secondary-butt">View Leaderboard</button>
                    </Link> */}
                </div>
            </div>
            <div className="hero-right">
                <div className="code-editor">

                    <div className="editor-header">
                        <div className="editor-controls">
                            <span className="window-red"></span>
                            <span className="window-yellow"></span>
                            <span className="window-green"></span>
                        </div>

                        <div className="editor-tabs">
                            <span className="active-tab">C++</span>
                            <span>Java</span>
                            <span>Python</span>
                        </div>
                    </div>

                    <div className="editor-body">
                        <pre>
                            <code>
                                <span className="keyword">#include</span>{" "}
                                <span className="directive">&lt;iostream&gt;</span>

                                {"\n\n"}

                                <span className="keyword">using</span> namespace std;

                                {"\n\n"}

                                <span className="keyword">int</span> <span className="function">main</span>() {"{"}

                                {"\n    "}
                                <span className="function">cout</span> &lt;&lt; <span className="string">"Hello, World!"</span>;

                                {"\n    "}
                                <span className="keyword">return</span> 0;

                                {"\n"}
                                {"}"}
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
        </section>
    )
}


export default Hero;