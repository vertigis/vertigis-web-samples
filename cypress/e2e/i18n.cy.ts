const sampleName = "i18n";

describe(sampleName, () => {
    it("shows english text", () => {
        cy.visit(`http://localhost:3001/#${sampleName}`);

        // Close the licensing alert
        cy.getViewer().find(`button[title="Close"]`).click();

        cy.getViewer().contains("I will be translated.").should("be.visible");
    });

    it("shows german text", () => {
        cy.visit(`http://localhost:3001/?locale=de#${sampleName}`);

        cy.getViewer()
            .contains("Dieser Text wird übersetzt.")
            .should("be.visible");
    });
});

export {};
