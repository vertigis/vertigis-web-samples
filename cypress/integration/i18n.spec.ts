const sampleName = "i18n";

const getViewer = () => {
    return (
        cy
            // .frameLoaded('iframe[data-cy="viewer-wrapper-frame"]')
            // .iframe('iframe[data-cy="viewer-wrapper-frame"]')
            .frameLoaded('iframe[data-cy="viewer-frame"]')
            .iframe('iframe[data-cy="viewer-frame"]')
    );
};

describe(sampleName, () => {
    it("shows english text", () => {
        cy.visit("http://localhost:3000/i18n");

        getViewer().contains("I will be translated.").should("be.visible");
    });

    it("shows german text", () => {
        cy.visit("http://localhost:3000/i18n?locale=de");

        getViewer()
            .contains("Dieser Text wird übersetzt.")
            .should("be.visible");
    });
});
