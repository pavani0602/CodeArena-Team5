describe('Problem Details Page UI E2E Tests', () => {
  const mockProblem = {
    id: 1,
    title: 'Two Sum',
    difficulty: 'EASY',
    category: 'Arrays & Hashing',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9']
  };

  const mockTestCases = [
    { id: 1, input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
    { id: 2, input: '[3,2,4]\n6', expectedOutput: '[1,2]' }
  ];

  beforeEach(() => {
    cy.clearLocalStorage();

    // Intercept backend requests for problem details, testcases, and submissions
    cy.intercept('GET', '/api/problems/1', {
      statusCode: 200,
      body: mockProblem
    }).as('getProblem');

    cy.intercept('GET', '/api/testcases/problem/1', {
      statusCode: 200,
      body: mockTestCases
    }).as('getTestCases');

    cy.intercept('GET', '/api/submissions/problem/1', {
      statusCode: 200,
      body: []
    }).as('getSubmissions');

    cy.visit('/problems/1');
    cy.wait(['@getProblem', '@getTestCases', '@getSubmissions']);
  });

  it('renders header workspace navigation and action buttons', () => {
    cy.get('.brand-logo-link').should('contain', 'CodeArena');
    cy.get('.back-nav-btn').should('contain', 'Problem List');
    cy.get('.nav-controls').should('be.visible');
    
    // Action buttons (Run & Submit)
    cy.contains('button', 'Run').should('be.visible');
    cy.contains('button', 'Submit').should('be.visible');
  });

  it('displays the guest exploration warning banner when unauthenticated', () => {
    cy.contains('You are exploring this workspace as a guest').should('be.visible');
    cy.contains('a', 'Sign In').should('have.attr', 'href', '/login');
  });

  it('hides guest banner when user is logged in', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'valid-jwt-token');
    });
    cy.visit('/problems/1');
    cy.contains('You are exploring this workspace as a guest').should('not.exist');
  });

  it('renders problem description, title, difficulty, and problem content', () => {
    cy.contains('Two Sum').should('be.visible');
    cy.contains(/easy/i).should('be.visible');
    cy.contains('Given an array of integers').should('be.visible');
    cy.contains('nums').should('be.visible');
    cy.contains('target').should('be.visible');
  });

  it('switches between problem description tabs (Description, Submissions, Hints & Editorial)', () => {
    // Click Submissions tab
    cy.contains('button', 'Submissions').click();
    cy.contains('Past Submissions').should('be.visible');
    cy.get('.submissions-table').should('be.visible');

    // Click back to Description tab
    cy.contains('button', 'Description').click();
    cy.contains('Given an array of integers').should('be.visible');
  });

  it('prompts unauthenticated user to log in when attempting to Run or Submit code', () => {
    let confirmText = '';
    cy.on('window:confirm', (str) => {
      confirmText = str;
      return false;
    });

    cy.contains('button', 'Run').click();
    
    cy.get('.brand-logo-link').then(() => {
      expect(confirmText).to.include('You must be logged in to compile or submit solutions');
    });
  });
});
