import { getMapOrSceneView } from "../mapUtils";

const sampleName = "third-party-lib";

const getMapCanvas = () => cy.getViewer().getMap().find("canvas");

describe(sampleName, () => {
    it("shows graph as a result of performing an identify", () => {
        cy.visit(`http://localhost:3000/${sampleName}`);

        // Wait for the map to be initialized.
        cy.getViewer().getMap();

        cy.getViewer().contains("button", "Identify").click();

        // Perform extent identify.
        getMapCanvas()
            // `pointerId` isn't sent by cypress, and the Esri map relies on this property.
            // See https://github.com/cypress-io/cypress/issues/5660
            .trigger("pointerdown", 400, 100, { pointerId: 1 })
            .trigger("pointermove", 600, 450, { pointerId: 1 })
            .trigger("pointerup", 600, 450, { pointerId: 1 });

        // Graph should be visible
        cy.getViewer().find(".ThreeDimensionalGraph").should("exist");
    });
});
