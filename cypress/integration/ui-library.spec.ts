const sampleName = "ui-library";

describe(sampleName, () => {
    it("has working buttons", () => {
        cy.visit(`http://localhost:3000/${sampleName}`);

        // Close the licensing alert
        cy.getViewer().find(`button[title="Close"]`).click();

        cy.getViewer().contains("button", "Medium Emphasis M").click();
        cy.getViewer().find('[role="dialog"]').contains("button", "OK").click();
    });

    it("has working tab navigation", () => {
        cy.visit(`http://localhost:3000/${sampleName}`);

        // Close the licensing alert
        cy.getViewer().find(`button[title="Close"]`).click();

        cy.getViewer().contains("button", "Typography").click();
        cy.getViewer().contains("h2", "h2. Heading").should("exist");
    });
});

export {};
