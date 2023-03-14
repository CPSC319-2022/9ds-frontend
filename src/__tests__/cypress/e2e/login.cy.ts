describe('QA website login', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('a').contains('Login').click()
    cy.url().should('be.equal', Cypress.config().baseUrl + 'login')
  })

  it('should successfully load the blog homepage, navigate to login under the header, and login', () => {
    cy.login('reader@test.com', 'reader123')
    cy.url().should('not.be.equal', Cypress.config().baseUrl + 'profile')
  })

  //TODO: find some way to generate google credentials and also make cypress recognize them
  // it('should successfully load the blog homepage, navigate to login under the header, and login via Google', () => {
  //   cy.contains('Sign in with Google').click()
  // })

  //sad path
  it('should load the blog homepage, navigate to login under the header, and fail login,', () => {
    cy.get('form').eq(1).submit()
    cy.url().should('be.equal', Cypress.config().baseUrl + 'login')
  })
})
