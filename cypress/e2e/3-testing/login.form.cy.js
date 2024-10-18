describe("Login Form", () => {
  beforeEach(() => {
    // Mock the login API response
    cy.intercept("POST", "/social/auth/login", {
      statusCode: 200,
      body: {
        accessToken: "fakeToken",
        name: "John Doe",
      },
    }).as("loginRequest");
  });

  it("should log in with valid credentials and redirect to the profile page", () => {
    // Visit the root index.html page
    cy.visit("/index.html");

    // Fill in the login form
    cy.get("#email").type("test@example.com"); // Use the id selector
    cy.get("#password").type("password123"); // Use the id selector

    // Submit the login form
    cy.get("form").submit();

    // Wait for the mock login API request to resolve
    cy.wait("@loginRequest");

    // Check if the token and profile were saved in localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.eq("fakeToken");
      expect(win.localStorage.getItem("profile")).to.eq(
        JSON.stringify({ name: "John Doe" }),
      );
    });

    // Verify redirection to the profile page
    cy.url().should("include", "/?view=profile&name=John%20Doe");
  });
});
