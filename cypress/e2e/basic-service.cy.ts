import { getMapOrSceneView } from "../mapUtils";

const sampleName = "basic-service";

const validateMarkupLayerSize = (size: number) =>
    cy
        .getViewer()
        .getMap()
        .should((mapEl) => {
            const mapView = getMapOrSceneView(mapEl);
            const markupLayerGraphics = mapView.map.allLayers.find(
                (layer: any) => layer.id === "__GCX_MARKUP"
            )?.graphics;
            expect(markupLayerGraphics?.length ?? 0).to.equal(size);
        });

describe(sampleName, () => {
    it("plots drive route from map clicks", () => {
        cy.visit(`http://localhost:3001/#${sampleName}`);

        // Close the licensing alert
        cy.getViewer().find(`button[title="Close"]`).click();

        // Should start with 0 graphics in markup layer.
        validateMarkupLayerSize(0);

        cy.getViewer().getMap().click(400, 100);

        // One graphic for first stop
        validateMarkupLayerSize(1);

        cy.getViewer().getMap().click(500, 200);

        // Two more graphics for second stop + route
        validateMarkupLayerSize(3);
    });
});
