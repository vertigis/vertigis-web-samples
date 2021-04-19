import { getMapOrSceneView } from "../mapUtils";

const sampleName = "embedded-map";

// Although we provide the exact number from the street view position when
// setting the map center position, the reported map center will not be exactly
// the same.
const mapCenterPrecision = 1e-4;
const markerCenterPrecision = 1e-9;

const expectMapAndMarkerCenter = (lat: number, lon: number) =>
    cy
        .getViewer()
        .getMap()
        .should((mapEl) => {
            const mapView = getMapOrSceneView(mapEl);

            // Check map center
            expect(mapView.center.latitude).to.be.closeTo(
                lat,
                mapCenterPrecision
            );
            expect(mapView.center.longitude).to.be.closeTo(
                lon,
                mapCenterPrecision
            );

            // Check location marker center
            const locationMarker = mapView.map.allLayers
                .find(
                    (layer: any) =>
                        layer.id === "__GCX_MAP_CONTEXT_AND_GEOLOCATION"
                )
                .graphics.getItemAt(0);
            expect(locationMarker.geometry.latitude).to.be.closeTo(
                lat,
                markerCenterPrecision
            );
            expect(locationMarker.geometry.longitude).to.be.closeTo(
                lon,
                markerCenterPrecision
            );
        });

describe(sampleName, () => {
    it("synchronizes marker position with street view position", () => {
        cy.visit(`http://localhost:3000/${sampleName}`);

        // Close the licensing alert
        cy.getViewer().find(`button[title="Close"]`).click();

        // TODO: Enable commented assertions. The use of `getPosition` from the mly API seems
        // to be non-deterministic as the logic appears to be using the camera
        // to calculate position instead of using the node directly.
        // https://github.com/geocortex/vertigis-web-samples/pull/17/files/2688f92a704c8037ade11017df6d7c0319abbf81#r498361346
        // https://github.com/mapillary/mapillary-js/blob/aa67afe85dacba0e738df2891b599d6b2371c510/src/viewer/Viewer.ts#L591-L606

        // The following test depends on the web scene being used and the current
        // state of the mapillary database.

        // Marker is set initially to match street view position.
        // expectMapAndMarkerCenter(51.910794210150954, 4.482710573867893);

        // Find the forward arrow by querying for the mapillary node id that
        // represents the next node in the forward direction.
        cy.getViewer().find('[data-key="6YM7-YAF5IMObwarROA2ZA"]').click();

        // Marker is updated to match new street view position.
        // expectMapAndMarkerCenter(51.910737342093, 4.482764649480002);
    });
});
