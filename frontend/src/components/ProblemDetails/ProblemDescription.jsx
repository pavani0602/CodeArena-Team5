import "./ProblemDescription.css";

function ProblemDescription() {
    return (
        <div className="problem-description">

            <div className="problem-header">

                <h1>Two Sum</h1>

                <div className="problem-meta">

                    <span className="difficulty easy">
                        Easy
                    </span>

                    <span className="tag">
                        Array
                    </span>

                    <span className="tag">
                        Hash Table
                    </span>

                </div>

            </div>

            <div className="description">

                <p>
                    Given an array of integers <strong>nums</strong> and an integer
                    <strong> target</strong>, return the indices of the two numbers
                    such that they add up to target.
                </p>

                <p>
                    You may assume that each input has exactly one solution, and
                    you may not use the same element twice.
                </p>

                <h3>Example 1</h3>

                <div className="example-box">

                    <p><strong>Input:</strong> nums = [2,7,11,15], target = 9</p>

                    <p><strong>Output:</strong> [0,1]</p>

                    <p>
                        <strong>Explanation:</strong> nums[0] + nums[1] = 9
                    </p>

                </div>

                <h3>Constraints</h3>

                <ul>

                    <li>2 ≤ nums.length ≤ 10⁴</li>

                    <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>

                    <li>-10⁹ ≤ target ≤ 10⁹</li>

                    <li>Exactly one valid answer exists.</li>

                </ul>

            </div>

        </div>
    );
}

export default ProblemDescription;