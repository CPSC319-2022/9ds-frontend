describe('QA website blog', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should bring authenticated user to create blog page when clicking CREATE BLOG POST in the header', () => {
    cy.get('button').contains('LOGIN/SIGN UP').click()
    cy.login('contributor@test.com', 'contributor123')
    cy.get('a').contains('CREATE BLOG POST').click()
    cy.url().should('include', '/create')
  })

  it('should bring authenticated user to create blog page when clicking Create blog in the footer', () => {
    cy.get('button').contains('Create blog').click()
    cy.url().should('include', '/create')
  })
})
