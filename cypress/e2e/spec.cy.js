describe('template spec', () => {
  it('passes', () => {
    cy.visit("http://localhost:3000")
    cy.get('#root button.bg-orange-600').click();
    
    
    cy.get('#root [name="email"]').click();
    cy.get('#root [name="email"]').type('yazh@gmail.com');
    cy.get('#root [name="password"]').click();
    cy.get('#root [name="password"]').type('1234567890');
    cy.get('#root [name="password"]').click();
    cy.get('#root button.w-full').click();
    cy.get('#root button.bg-blue-600').click();
    cy.get('#root p.font-medium').click();
  })
})