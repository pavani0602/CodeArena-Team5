import { useState } from 'react';
import { fetchApi } from '../services/api';

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

  const simulateExecution = async (code, language, isSubmit = false) => {
    if (!currentProblem) return;
    
    setCurrentState(SUBMISSION_STATES.COMPILING);
    setFeedback(null);
    setCurrentTestIndex(0);

    try {
      if (isSubmit) {
        setCurrentState(SUBMISSION_STATES.RUNNING_TESTS);
        // Hit real submit API
        const response = await fetchApi(`/api/submissions/problem/${currentProblem.id}`, {
          method: 'POST',
          body: JSON.stringify({ language, code })
        });
        
        const data = await response.json();
        if (!response.ok) {
           setCurrentState(SUBMISSION_STATES.COMPILE_ERROR);
           setFeedback({ status: "Error", message: data.message || "Execution failed" });
           return;
        }
        
        setCurrentTestIndex(totalTestCases);

        if (data.status === 'ACCEPTED') {
          setCurrentState(SUBMISSION_STATES.SUCCESS);
          
          let maxExecutionTime = 0;
          let finalUserOutput = "";
          let finalExpectedOutput = "";
          
          if (data.results && data.results.length > 0) {
            maxExecutionTime = Math.max(...data.results.map(r => r.executionTimeMs || 0));
            const lastResult = data.results[data.results.length - 1];
            finalUserOutput = lastResult.actualOutput || "";
            finalExpectedOutput = lastResult.expectedOutput || "";
          }
          
          setFeedback({
            status: "Accepted",
            message: "Excellent! All test cases passed.",
            runtime: `${maxExecutionTime} ms`,
            userOutput: finalUserOutput,
            expectedOutput: finalExpectedOutput
          });
        } else if (data.status === 'COMPILATION_ERROR') {
          setCurrentState(SUBMISSION_STATES.COMPILE_ERROR);
          setFeedback({ status: "Compile Error", message: data.errorMessage || "Failed to compile." });
        } else {
          setCurrentState(SUBMISSION_STATES.FAILED_TEST);
          const failedResult = data.results?.find(r => r.status === data.status || !r.passed) || {};
          setFeedback({
            status: data.status, // e.g. WRONG_ANSWER or RUNTIME_ERROR
            message: data.status === 'RUNTIME_ERROR' ? data.message || "Runtime Error" : "Your code failed on a test case.",
            expectedOutput: failedResult.expectedOutput || "N/A",
            userOutput: failedResult.actualOutput || "None",
            errorTrace: failedResult.errorMessage || data.message
          });
        }
      } else {
        // Just Run Code against sample testcase
        setCurrentState(SUBMISSION_STATES.RUNNING_TESTS);
        const response = await fetchApi(`/api/execute`, {
          method: 'POST',
          body: JSON.stringify({ language, code, problemId: currentProblem.id })
        });
        
        const data = await response.json();
        if (!response.ok) {
           setCurrentState(SUBMISSION_STATES.COMPILE_ERROR);
           setFeedback({ status: "Error", message: data.message || "Execution failed" });
           return;
        }

        setCurrentTestIndex(1); // Ran 1 sample

        if (data.status === 'SUCCESS' || data.status === 'ACCEPTED') {
          setCurrentState(SUBMISSION_STATES.SUCCESS);
          setFeedback({
            status: "Accepted",
            message: "Your code ran successfully against the sample testcase.",
            userOutput: data.output,
            expectedOutput: data.expectedOutput,
            runtime: `${data.executionTimeMs || 0} ms`
          });
        } else if (data.status === 'COMPILATION_ERROR') {
          setCurrentState(SUBMISSION_STATES.COMPILE_ERROR);
          setFeedback({ status: "Compile Error", message: data.error || data.message || "Failed to compile." });
        } else {
          setCurrentState(SUBMISSION_STATES.FAILED_TEST);
          setFeedback({
            status: data.status, 
            message: data.status === 'RUNTIME_ERROR' ? data.error || "Runtime Error" : "Your code produced incorrect output for the sample.",
            userOutput: data.output,
            expectedOutput: data.expectedOutput,
            errorTrace: data.error
          });
        }
      }
    } catch (err) {
      console.error(err);
      setCurrentState(SUBMISSION_STATES.COMPILE_ERROR);
      setFeedback({ status: "Network Error", message: "Failed to communicate with the server." });
    }
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