import "./ProblemDescription.css";

// Mock Database of problem descriptions
const PROBLEM_DATA = {
    "1": {
        title: "Two Sum",
        difficulty: "Easy",
        tags: ["Array", "Hash Table"],
        description: (
            <>
                <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return the indices of the two numbers such that they add up to target.</p>
                <p>You may assume that each input has exactly one solution, and you may not use the same element twice.</p>
            </>
        ),
        examples: [
            { id: 1, input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 9." }
        ],
        constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "-10⁹ ≤ target ≤ 10⁹"]
    },
    "2": {
        title: "Valid Parentheses",
        difficulty: "Easy",
        tags: ["String", "Stack"],
        description: (
            <>
                <p>Given a string <code>s</code> containing just the characters <code>'(', ')', '{', '}', '['</code> and <code>']'</code>, determine if the input string is valid.</p>
                <p>An input string is valid if open brackets are closed by the same type of brackets and in the correct order.</p>
            </>
        ),
        examples: [
            { id: 1, input: 's = "()[]{}"', output: "true", explanation: "" }
        ],
        constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of parentheses only '()[]{}'."]
    },
    "3": {
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        tags: ["Hash Table", "String", "Sliding Window"],
        description: (
            <>
                <p>Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.</p>
            </>
        ),
        examples: [
            { id: 1, input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' }
        ],
        constraints: ["0 ≤ s.length ≤ 5 * 10⁴", "s consists of English letters, digits, symbols and spaces."]
    },
    "4": {
        title: "Merge Intervals",
        difficulty: "Medium",
        tags: ["Array", "Sorting"],
        description: (
            <>
                <p>Given an array of <code>intervals</code> where <code>intervals[i] = [start_i, end_i]</code>, merge all overlapping intervals.</p>
            </>
        ),
        examples: [
            { id: 1, input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]." }
        ],
        constraints: ["1 ≤ intervals.length ≤ 10⁴", "intervals[i].length == 2"]
    },
    "5": {
        title: "Binary Tree Inorder Traversal",
        difficulty: "Easy",
        tags: ["Tree", "Depth-First Search", "Binary Tree"],
        description: (
            <>
                <p>Given the <code>root</code> of a binary tree, return the <em>inorder traversal</em> of its nodes' values.</p>
            </>
        ),
        examples: [
            { id: 1, input: "root = [1,null,2,3]", output: "[1,3,2]", explanation: "" }
        ],
        constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 ≤ Node.val ≤ 100"]
    },
    "6": {
        title: "Course Schedule",
        difficulty: "Medium",
        tags: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"],
        description: (
            <>
                <p>There are a total of <code>numCourses</code> courses you have to take, labeled from <code>0</code> to <code>numCourses - 1</code>.</p>
                <p>You are given an array <code>prerequisites</code> where <code>prerequisites[i] = [a_i, b_i]</code> indicates that you <strong>must</strong> take course <code>b_i</code> first if you want to take course <code>a_i</code>. Return <code>true</code> if you can finish all courses.</p>
            </>
        ),
        examples: [
            { id: 1, input: "numCourses = 2, prerequisites = [[1,0]]", output: "true", explanation: "There are a total of 2 courses to take. To take course 1 you should have finished course 0. So it is possible." }
        ],
        constraints: ["1 ≤ numCourses ≤ 2000", "0 ≤ prerequisites.length ≤ 5000"]
    },
    "7": {
        title: "Number of Islands",
        difficulty: "Medium",
        tags: ["Array", "Depth-First Search", "Breadth-First Search", "Matrix"],
        description: (
            <>
                <p>Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of <code>'1'</code>s (land) and <code>'0'</code>s (water), return <em>the number of islands</em>.</p>
            </>
        ),
        examples: [
            { id: 1, input: 'grid = [["1","1","1"],["1","1","0"],["0","0","0"]]', output: "1", explanation: "" }
        ],
        constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 300"]
    },
    "8": {
        title: "Word Ladder",
        difficulty: "Hard",
        tags: ["Hash Table", "String", "Breadth-First Search"],
        description: (
            <>
                <p>A <strong>transformation sequence</strong> from word <code>beginWord</code> to word <code>endWord</code> using a dictionary <code>wordList</code> is a sequence of words where adjacent words differ by exactly one letter.</p>
                <p>Given two words, <code>beginWord</code> and <code>endWord</code>, and a dictionary <code>wordList</code>, return <em>the <strong>number of words</strong> in the shortest transformation sequence</em>, or <code>0</code> if no such sequence exists.</p>
            </>
        ),
        examples: [
            { id: 1, input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: "5", explanation: 'As one shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.' }
        ],
        constraints: ["1 ≤ beginWord.length ≤ 10", "wordList[i].length == beginWord.length"]
    },
    "9": {
        title: "LRU Cache",
        difficulty: "Hard",
        tags: ["Design", "Hash Table", "Linked List", "Doubly-Linked List"],
        description: (
            <>
                <p>Design a data structure that follows the constraints of a <strong>Least Recently Used (LRU) cache</strong>.</p>
                <p>Implement the <code>LRUCache</code> class with <code>get</code> and <code>put</code> methods operating in <code>O(1)</code> average time complexity.</p>
            </>
        ),
        examples: [
            { id: 1, input: '["LRUCache", "put", "put", "get"], [[2], [1, 1], [2, 2], [1]]', output: "[null, null, null, 1]", explanation: "The cache stores key-value pairs up to capacity 2." }
        ],
        constraints: ["1 ≤ capacity ≤ 3000", "At most 2 * 10⁵ calls will be made to get and put."]
    },
    "10": {
        title: "Kth Largest Element",
        difficulty: "Medium",
        tags: ["Array", "Divide and Conquer", "Sorting", "Heap (Priority Queue)"],
        description: (
            <>
                <p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <em>the</em> <code>k</code><em>th largest element in the array</em>.</p>
                <p>Note that it is the <code>k</code>th largest element in the sorted order, not the <code>k</code>th distinct element.</p>
            </>
        ),
        examples: [
            { id: 1, input: "nums = [3,2,1,5,6,4], k = 2", output: "5", explanation: "" }
        ],
        constraints: ["1 ≤ k ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"]
    },
    "11": {
        title: "Climbing Stairs",
        difficulty: "Easy",
        tags: ["Math", "Dynamic Programming", "Memoization"],
        description: (
            <>
                <p>You are climbing a staircase. It takes <code>n</code> steps to reach the top.</p>
                <p>Each time you can either climb <code>1</code> or <code>2</code> steps. In how many distinct ways can you climb to the top?</p>
            </>
        ),
        examples: [
            { id: 1, input: "n = 3", output: "3", explanation: "There are three ways to climb to the top: (1 step + 1 step + 1 step), (1 step + 2 steps), or (2 steps + 1 step)." }
        ],
        constraints: ["1 ≤ n ≤ 45"]
    },
    "12": {
        title: "Search in Rotated Sorted Array",
        difficulty: "Medium",
        tags: ["Array", "Binary Search"],
        description: (
            <>
                <p>There is an integer array <code>nums</code> sorted in ascending order (with <strong>distinct</strong> values).</p>
                <p>Prior to being passed to your function, <code>nums</code> is possibly <strong>rotated</strong>. Given the array <code>nums</code> after the possible rotation and an integer <code>target</code>, return <em>the index of </em><code>target</code><em> if it is in </em><code>nums</code><em>, or </em><code>-1</code><em> if it is not in </em><code>nums</code>.</p>
            </>
        ),
        examples: [
            { id: 1, input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4", explanation: "0 is found at index 4." }
        ],
        constraints: ["1 ≤ nums.length ≤ 5000", "-10⁴ ≤ nums[i] ≤ 10⁴", "All values of nums are unique."]
    }
};

function ProblemDescription({ problemId }) {
    // Look up the problem data using the ID string passed down from the parent
    const problem = PROBLEM_DATA[problemId];

    // Fallback if the user navigates to an ID that doesn't exist yet
    if (!problem) {
        return (
            <div className="problem-description">
                <h2>Problem Not Found</h2>
                <p>The problem challenge you are looking for does not exist or hasn't been added yet.</p>
            </div>
        );
    }

    return (
        <div className="problem-description">
            <div className="problem-header">
                <h1>{problem.title}</h1>
                <div className="problem-meta">
                    <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                        {problem.difficulty}
                    </span>
                    {problem.tags.map((tag, idx) => (
                        <span key={idx} className="tag">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="description">
                {problem.description}

                {problem.examples.map((example) => (
                    <div key={example.id}>
                        <h3>Example {example.id}</h3>
                        <div className="example-box">
                            <p><strong>Input:</strong> {example.input}</p>
                            <p><strong>Output:</strong> {example.output}</p>
                            {example.explanation && (
                                <p><strong>Explanation:</strong> {example.explanation}</p>
                            )}
                        </div>
                    </div>
                ))}

                <h3>Constraints</h3>
                <ul>
                    {problem.constraints.map((constraint, idx) => (
                        <li key={idx}>{constraint}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ProblemDescription;