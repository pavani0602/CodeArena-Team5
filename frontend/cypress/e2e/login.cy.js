describe('Login Flow E2E Tests', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/login');
  });

  it('renders the login page elements correctly', () => {
    cy.contains('.auth-logo', 'CodeArena').should('be.visible');
    cy.contains('h2.auth-title', 'Welcome Back').should('be.visible');
    cy.get('input[name="email"]').should('be.visible').and('have.attr', 'placeholder', 'you@example.com');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Sign In');
    cy.get('#forgot-link').should('be.visible').and('contain', 'Forgot Password?');
  });

  it('switches between User and Admin role tabs', () => {
    // Switch to Admin role
    cy.contains('.role-tab', 'Admin').click();
    cy.contains('h2.auth-title', 'Admin Workspace Sign In').should('be.visible');
    cy.get('input[name="email"]').should('have.attr', 'placeholder', 'admin@codearena.com');
    cy.get('button[type="submit"]').should('contain', 'Enter Panel');

    // Switch back to User role
    cy.contains('.role-tab', 'User').click();
    cy.contains('h2.auth-title', 'Welcome Back').should('be.visible');
    cy.get('input[name="email"]').should('have.attr', 'placeholder', 'you@example.com');
    cy.get('button[type="submit"]').should('contain', 'Sign In');
  });

  it('displays an error banner when login fails', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials. Please try again.' }
    }).as('loginRequest');

    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.get('.auth-error-banner')
      .should('be.visible')
      .and('contain', 'Invalid credentials. Please try again.');
  });

  it('successfully logs in as a standard user and redirects to /problems', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'mock-user-jwt-token',
        username: 'testcoder',
        role: 'USER'
      }
    }).as('loginSuccess');

    let alertText = '';
    cy.on('window:alert', (text) => {
      alertText = text;
    });

    cy.get('input[name="email"]').type('coder@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');

    cy.url().should('include', '/problems').then(() => {
      expect(alertText).to.include('Welcome back to CodeArena, testcoder!');
    });
    
    // Check localStorage values
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.equal('mock-user-jwt-token');
      expect(win.localStorage.getItem('userRole')).to.equal('user');
      expect(win.localStorage.getItem('userEmail')).to.equal('coder@example.com');
    });
  });

  it('successfully logs in as an admin and redirects to /admin', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'mock-admin-jwt-token',
        username: 'adminuser',
        role: 'ADMIN'
      }
    }).as('adminLoginSuccess');

    let alertText = '';
    cy.on('window:alert', (text) => {
      alertText = text;
    });

    cy.contains('.role-tab', 'Admin').click();
    cy.get('input[name="email"]').type('admin@codearena.com');
    cy.get('input[name="password"]').type('adminpass');
    cy.get('button[type="submit"]').click();

    cy.wait('@adminLoginSuccess');

    cy.url().should('include', '/admin').then(() => {
      expect(alertText).to.include('Welcome back to CodeArena, adminuser!');
    });

    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.equal('mock-admin-jwt-token');
      expect(win.localStorage.getItem('userRole')).to.equal('admin');
    });
  });
});
