import { getMapOrSceneView } from "../mapUtils";

const sampleName = "embedded-map";

// Although we provide the exact number from the street view position when
// setting the map center position, the reported map center will not be exactly
// the same.
const mapCenterPrecision = 1e-3;
const markerCenterPrecision = 1e-3;

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

// TODO: For some reason the Geocortex Viewer isn't loading in the test on the
// build server. Disabling this test until it works.
describe(sampleName, () => {
    // The following test depends on the web scene being used and the current
    // state of the mapillary database.
    it("synchronizes marker position with street view position", () => {
        // cy.visit(`http://localhost:3000/${sampleName}`);
        // Close the licensing alert
        // cy.getViewer().find(`button[title="Close"]`).click();
        // The use of `getPosition` from the mly API seems to be
        // non-deterministic as the logic appears to be using the camera to
        // calculate position instead of using the image directly.
        // https://github.com/geocortex/vertigis-web-samples/pull/17/files/2688f92a704c8037ade11017df6d7c0319abbf81#r498361346
        // https://github.com/mapillary/mapillary-js/blob/main/src/viewer/Viewer.ts#L610
        // Marker is set initially to match street view position.
        // expectMapAndMarkerCenter(51.90797166666704, 4.489869999999996);
        // Find the forward arrow by querying for the mapillary image id that
        // represents the next image in the forward direction. Note that it's
        // possible that this value might change over time and might need to be
        // updated.
        // cy.getViewer().find('[data-id="1876951449133876"]').click();
        // Marker is updated to match new street view position.
        // expectMapAndMarkerCenter(51.908061666667, 4.4896200000001);
    });
});
