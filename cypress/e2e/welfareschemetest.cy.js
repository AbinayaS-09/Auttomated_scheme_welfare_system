describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  });

  it('testing', function() {
    describe("User Login & Dashboard Test", () => {
    
      it("Should login and load dashboard correctly", () => {
        describe("User Login & Dashboard Test", () => {
        
          it("Should navigate to login and load dashboard", () => {
                    
            // 1️⃣ Visit homepage
            cy.visit("http://localhost:3000");
                    
            // 2️⃣ Click User Login button
            cy.contains("User Login").click();
                    
            // 3️⃣ Verify URL changed to login page
            cy.url().should("include", "/user/login");
                    
            // 4️⃣ Enter credentials
            cy.get('[name="email"]').type("yazh@gmail.com");
            cy.get('[name="password"]').type("1234567890");
                    
            // 5️⃣ Click submit
            cy.get("button[type='submit']").click();
                    
            // 6️⃣ Verify redirect to dashboard
            cy.url().should("include", "/user/home");
                    
            // 7️⃣ Verify dashboard loaded
            cy.contains("Welcome to Your Dashboard!").should("be.visible");
            cy.contains("Total Schemes").should("exist");
                    
          });
        
        });
      });
    
    });
  });
})