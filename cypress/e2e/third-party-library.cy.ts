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
        .wait(100)
        .trigger("pointermove", fromX, fromY)
        .wait(100)
        .click()
        .trigger("pointermove", toX, toY)
        .wait(100)
        .click();

describe(sampleName, () => {
    it("renders graph as a result of performing an identify", () => {
        cy.visit(sampleName);

        // Close the licensing alert
        cy.getViewer().find(`button[title="Close"]`).click();

        // Wait for the map to be initialized.
        cy.getViewer().getMap();

        // Perform extent identify.
        cy.getViewer().contains("button", "Identify").click();
        performExtentIdentify(400, 100, 900, 450);

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
        performExtentIdentify(10, 10, 20, 20);

        // Graph should be visible and have no nodes rendered.
        cy.getViewer()
            .find(".ThreeDimensionalGraph")
            .should("exist")
            .should(($graphComponent) => {
                const nodeCount = Number.parseInt(
                    $graphComponent[0].dataset.nodeCount ?? "0"
                );

                expect(nodeCount).to.equal(0);
            });
    });
});
