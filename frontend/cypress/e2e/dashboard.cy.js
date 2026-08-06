describe('Dashboard Rendering & Auth Guard E2E Tests', () => {
  it('redirects unauthenticated user to /login when accessing /dashboard', () => {
    cy.clearLocalStorage();
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });

  context('Authenticated User Dashboard', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      // Set localStorage token before visiting protected dashboard
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'mock-user-token');
        win.localStorage.setItem('userRole', 'user');
        win.localStorage.setItem('userEmail', 'coder@codearena.com');
      });

      // Mock API endpoint for streak stats
      cy.intercept('GET', '/api/submissions/summary', {
        statusCode: 200,
        body: { streak: 5 }
      }).as('getSummary');

      cy.visit('/dashboard');
    });

    it('renders the Dashboard page content and title', () => {
      cy.contains('h1', 'Dashboard').should('be.visible');
      cy.contains('h2', 'Upcoming Feature').should('be.visible');
    });

    it('renders the Navbar with authenticated user actions and navigation links', () => {
      cy.contains('h2', 'CodeArena').should('be.visible');
      cy.contains('a', 'Problems').should('be.visible');
      cy.contains('a', 'Leaderboard').should('be.visible');
      cy.contains('a', 'Discussion').should('be.visible');
      
      // Check streak badge
      cy.get('.streak-badge').should('be.visible').and('contain', '5');
      
      // Check user role label in profile trigger
      cy.get('.profile-trigger-btn').should('be.visible').and('contain', 'Coder');
    });

    it('opens profile dropdown menu and handles Sign Out action', () => {
      let alertText = '';
      cy.on('window:alert', (text) => {
        alertText = text;
      });

      // Click profile trigger to open dropdown
      cy.get('.profile-trigger-btn').click();
      cy.get('.navbar-dropdown-menu').should('be.visible');
      cy.contains('.dropdown-user-header strong', 'coder@codearena.com').should('be.visible');

      // Click Sign Out
      cy.get('.dropdown-logout-action').click();

      cy.url().should('eq', Cypress.config().baseUrl + '/').then(() => {
        expect(alertText).to.include('Signed out successfully.');
      });

      // Verify localStorage was cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
        expect(win.localStorage.getItem('userRole')).to.be.null;
      });
    });
  });
});
