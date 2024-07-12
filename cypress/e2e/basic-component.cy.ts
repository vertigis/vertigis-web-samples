const sampleName = "basic-component";

describe(sampleName, () => {
    it("controls model state using button", () => {
        cy.visit(`http://localhost:3001/#${sampleName}`);

        // Close the licensing alert
        cy.getViewer().find(`button[title="Close"]`).click();

        cy.getViewer().find(`[data-test="BasicComponent-btn"]`).click();
        cy.getViewer().contains("BOO!").should("be.visible");

        cy.getViewer().find("button").contains("Hide Me").click();
        cy.getViewer().contains("BOO!").should("not.exist");
    });
});

export {};
