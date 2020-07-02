import { getMapOrSceneView } from "../mapUtils";

const sampleName = "embedded-map";

const validateMapCenter = (x: number, y: number) =>
    cy
        .getViewer()
        .getMap()
        .should((mapEl) => {
            const mapView = getMapOrSceneView(mapEl);
            expect(mapView.center.x).to.equal(x);
            expect(mapView.center.y).to.equal(y);
        });

describe(sampleName, () => {
    it("synchronizes location marker with street view position", () => {
        cy.visit(`http://localhost:3000/${sampleName}`);

        validateMapCenter(499015.8625114415, 6784004.681472555);

        cy.getViewer().find(".DirectionsCircle").eq(2).click();

        validateMapCenter(499022.066058038, 6783997.054675632);
    });
});
