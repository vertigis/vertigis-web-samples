export {};

const sampleName = "third-party-lib";

const getMapCanvas = () => cy.getViewer().getMap().find("canvas");

const performExtentIdentify = (
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
) =>
    getMapCanvas()
        // `pointerId` isn't sent by cypress, and the Esri map relies on this property.
        // See https://github.com/cypress-io/cypress/issues/5660
        .trigger("pointerdown", fromX, fromY, {
            pointerId: Cypress.browser.name === "chrome" ? 1 : 0,
        })
        .trigger("pointermove", toX, toY, {
            pointerId: Cypress.browser.name === "chrome" ? 1 : 0,
        })
        .trigger("pointerup", toX, toY, {
            pointerId: Cypress.browser.name === "chrome" ? 1 : 0,
        });

describe(sampleName, () => {
    it("renders graph as a result of performing an identify", () => {
        cy.visit(`http://localhost:3000/${sampleName}`);

        // Close the licensing alert
        cy.getViewer().find(`button[title="Close"]`).click();

        // Wait for the map to be initialized.
        cy.getViewer().getMap();

        // Perform extent identify.
        cy.getViewer().contains("button", "Identify").click();
        performExtentIdentify(400, 100, 600, 450);

        // Graph should be visible and have nodes rendered.
        cy.getViewer()
            .find(".ThreeDimensionalGraph")
            .should("exist")
            .should(($graphComponent) => {
                const nodeCount = Number.parseInt(
                    $graphComponent[0].dataset.nodeCount ?? ""
                );

                // Minimum would be one surveyor and one survey.
                expect(nodeCount).to.be.at.least(2);
            });

        // Identify again in an area that shouldn't have any results.
        cy.getViewer().contains("button", "Identify").click();
        performExtentIdentify(1, 1, 3, 3);

        // Graph should be visible and have no nodes rendered.
        cy.getViewer()
            .find(".ThreeDimensionalGraph")
            .should("exist")
            .should(($graphComponent) => {
                const nodeCount = Number.parseInt(
                    $graphComponent[0].dataset.nodeCount ?? ""
                );

                expect(nodeCount).to.equal(0);
            });
    });
});
