import { useState } from 'react';

export const SUBMISSION_STATES = {
  IDLE: 'IDLE',
  COMPILING: 'COMPILING',
  RUNNING_TESTS: 'RUNNING_TESTS',
  SUCCESS: 'SUCCESS',
  FAILED_TEST: 'FAILED_TEST',
  COMPILE_ERROR: 'COMPILE_ERROR'
};

export function useSubmissionStateMachine(currentProblem) {
  const [currentState, setCurrentState] = useState(SUBMISSION_STATES.IDLE);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const totalTestCases = currentProblem?.testCases?.length || 2;

  const simulateExecution = (code) => {
    // Reset any previous state metrics
    setCurrentState(SUBMISSION_STATES.COMPILING);
    setFeedback(null);
    setCurrentTestIndex(0);

    // 1. Simulate Compilation Stage (1.5 seconds)
    setTimeout(() => {
      // Basic check for empty inputs or severe syntax breaks
      if (!code || code.trim() === "" || code.includes("syntax_error_simulation")) {
        setCurrentState(SUBMISSION_STATES.COMPILE_ERROR);
        setFeedback({
          status: "Compile Error",
          message: "IndentationError: expected an indented block after function definition on line 2\n    pass\n    ^"
        });
        return;
      }

      // 2. Transition to Running Test Cases Evaluation Stage
      setCurrentState(SUBMISSION_STATES.RUNNING_TESTS);
      
      let currentCase = 0;
      const interval = setInterval(() => {
        currentCase++;
        setCurrentTestIndex(currentCase);

        if (currentCase >= totalTestCases) {
          clearInterval(interval);

          // 3. Robustly Extract the executed output return line
          // Matches all instances of return statements globally
          const returnRegex = /return\s+([^\n;]+)/g;
          const matches = [...code.matchAll(returnRegex)];
          
          let userActualOutput = "None";
          
          if (matches.length > 0) {
            // Smart Evaluation Strategy:
            // If the user has a hardcoded array override matching the expected target, pick that match!
            // Otherwise, select the most descriptive/inner non-empty return block found.
            const expectedOutput = currentProblem?.exampleOutput || "[0,1]";
            const cleanExpected = expectedOutput.replace(/\s+/g, '');
            
            const targetedMatch = matches.find(m => 
              m[1].trim().replace(/\s+/g, '') === cleanExpected
            );
            
            // Fallback to the primary solution path return block if no explicit array match
            const finalMatch = targetedMatch || matches[0];
            userActualOutput = finalMatch[1].trim();
          }

          // Handle JavaScript / C++ style bracket definitions cleanly: e.g., {} or new int[]
          if (userActualOutput.includes("{}")) userActualOutput = "[]";
          if (userActualOutput.includes("new int[]")) {
            const bracketMatch = userActualOutput.match(/\{([^}]+)\}/);
            userActualOutput = bracketMatch ? `[${bracketMatch[1]}]` : "[]";
          }

          const expectedOutput = currentProblem?.exampleOutput || "[0,1]";

          // 4. Compare absolute output formatting keys
          const isCorrect = userActualOutput.replace(/\s+/g, '') === expectedOutput.replace(/\s+/g, '');

          if (isCorrect) {
            setCurrentState(SUBMISSION_STATES.SUCCESS);
            setFeedback({
              status: "Accepted",
              message: "Excellent! Your execution metrics hit code solution parameters cleanly.",
              userOutput: userActualOutput,
              expectedOutput: expectedOutput,
              runtime: "45 ms",
              memory: "16.4 MB"
            });
          } else {
            setCurrentState(SUBMISSION_STATES.FAILED_TEST);
            setFeedback({
              status: "Wrong Answer",
              message: "Your code output did not match the expected test case criteria.",
              userOutput: userActualOutput,
              expectedOutput: expectedOutput
            });
          }
        }
      }, 600); // Progresses through test cases every 600ms
    }, 1500);
  };

  const resetState = () => {
    setCurrentState(SUBMISSION_STATES.IDLE);
    setCurrentTestIndex(0);
    setFeedback(null);
  };

  return {
    currentState,
    currentTestIndex,
    feedback,
    simulateExecution,
    resetState,
    totalTestCases
  };
}