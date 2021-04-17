const sampleName = "i18n";

describe(sampleName, () => {
    it("shows english text", () => {
        cy.visit(`http://localhost:3000/${sampleName}`);

        // Close the licensing alert
        cy.getViewer().find(`button[title="Close"]`).click();

        cy.getViewer().contains("I will be translated.").should("be.visible");
    });

    it("shows german text", () => {
        cy.visit(`http://localhost:3000/${sampleName}?locale=de`);

        // Close the licensing alert
        cy.getViewer().find(`button[title="Close"]`).click();

        cy.getViewer()
            .contains("Dieser Text wird übersetzt.")
            .should("be.visible");
    });
});

export {};
