describe('QA website login', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('a').contains('Login').click()
    cy.url().should('include', '/login')
  })

  // This is a sign in with a non Google account. Google sign in will be done manually with a test account
  it('should successfully load the blog homepage, navigate to login under the header, and login', () => {
    cy.login('reader@test.com', 'reader123')
    cy.url().should('include', '/profile')
  })

  it('should load the blog homepage, navigate to login under the header, ' +
    'and fail login because of at least 1 credential missing,', () => {
    // no credentials filled
    cy.get('form').eq(1).submit()
    cy.contains(`Email can't be empty.`)
    cy.contains(`Password can't be empty.`)
    cy.url().should('include', '/login')

    // only email filled
    cy.get('input[id="signInEmail"]').type('reader@test.com{enter}', {log: false})
    cy.contains(`Email can't be empty.`).should('not.exist')
    cy.contains(`Password can't be empty.`)
    cy.url().should('include', '/login')
    cy.get('input[id="signInEmail"]').clear()

    // only password filled
    cy.get('input[id="login-outlined-adornment-password"]').type(`reader123{enter}`, {log: false})
    cy.contains(`Password can't be empty.`).should('not.exist')
    cy.contains(`Email can't be empty.`)
    cy.url().should('include', '/login')
  })

  it('should fail login because at least 1 credential is incorrect', () => {
    // both incorrect/email incorrect
    cy.login('incorrectEmail@test.com', 'incorrectPassword')
    cy.contains(`Cannot find user with that username and password.`)
    cy.url().should('include', '/login')
    cy.get('input[id="signInEmail"]').clear()
    cy.get('input[id="login-outlined-adornment-password"]').clear()

    // invalid email
    cy.login('invalidEmail', 'reader123')
    cy.contains(`The email address is not valid.`)
    cy.url().should('include', '/login')
    cy.get('input[id="signInEmail"]').clear()
    cy.get('input[id="login-outlined-adornment-password"]').clear()

    // password incorrect
    cy.login('reader@test.com', 'incorrectPassword')
    cy.contains(`Incorrect password.`)
    cy.url().should('include', '/login')
  })
})
