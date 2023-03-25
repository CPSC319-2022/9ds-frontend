describe('QA website blog', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should bring unauthenticated user to sign in page when clicking BLOG in the header', () => {
    cy.get('a').contains('BLOG').click()
    cy.url().should('include', '/login')
  })

  it('should bring authenticated user to create blog page when clicking BLOG in the header', () => {
    cy.get('a').contains('Login').click()
    cy.login('reader@test.com', 'reader123')
    cy.get('a').contains('BLOG').click()
    cy.url().should('include', '/create')
  })

  it('should bring unauthenticated user to sign in page when clicking Blog in the footer', () => {
    cy.get('a').contains('Blog').click()
    cy.url().should('include', '/login')
  })

  it('should bring authenticated user to create blog page when clicking Blog in the footer', () => {
    cy.get('a').contains('Login').click()
    cy.login('reader@test.com', 'reader123')
    cy.get('a').contains('Blog').click()
    cy.url().should('include', '/create')
  })
})
