describe('QA website login', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('a').contains('Login').click()
    cy.url().should('include', '/login')
  })

  afterEach(() => {
    cy.clearCookies()
  })

  // This is a sign in with a non Google account. Google sign in will be done manually with a test account
  it('should successfully load the blog homepage, navigate to login under the header, and login', () => {
    cy.login('reader@test.com', 'reader123')
  })

  // Sad path
  it('should load the blog homepage, navigate to login under the header, and fail login,', () => {
    cy.get('form').eq(1).submit()
    cy.url().should('include', '/login')
  })
})
