import "./CodeEditor.css";

function CodeEditor() {
    return (
        <div className="code-editor-container">

            <div className="editor-header">

                <h3>Code Editor</h3>

                <select className="language-select">
                    <option>Java</option>
                    <option>Python</option>
                    <option>C++</option>
                </select>

            </div>

            <div className="editor-placeholder">

                <pre>
{`class Solution {

    public int[] twoSum(int[] nums, int target) {

        // Write your solution here

    }

}`}
                </pre>

            </div>

        </div>
    );
}

export default CodeEditor;