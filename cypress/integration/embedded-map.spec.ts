import { getMapOrSceneView } from "../mapUtils";

const sampleName = "embedded-map";

// Although we provide the exact number from the street view position when
// setting the location marker and map center positions, the actual position of
// the map and marker won't be exact.
const numberPrecision = 1e-6;

const expectMapAndMarkerCenter = (lat: number, lon: number) =>
    cy
        .getViewer()
        .getMap()
        .should((mapEl) => {
            const mapView = getMapOrSceneView(mapEl);

            // Check map center
            expect(mapView.center.latitude).to.be.closeTo(lat, numberPrecision);
            expect(mapView.center.longitude).to.be.closeTo(
                lon,
                numberPrecision
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
                numberPrecision
            );
            expect(locationMarker.geometry.longitude).to.be.closeTo(
                lon,
                numberPrecision
            );
        });

describe(sampleName, () => {
    it("synchronizes marker position with street view position", () => {
        cy.visit(`http://localhost:3000/${sampleName}`);

        // TODO: Enable tests. The use of `getPosition` from the mly API seems
        // to be non-deterministic as the logic appears to be using the camera
        // to calculate position instead of using the node directly.
        // https://github.com/mapillary/mapillary-js/blob/aa67afe85dacba0e738df2891b599d6b2371c510/src/viewer/Viewer.ts#L591-L606

        // Marker is set initially to match street view position.
        // expectMapAndMarkerCenter(51.91078005950694, 4.482707136338764);

        // Find the forward arrow by querying for the mapillary node id that
        // represents the next node in the forward direction.
        cy.getViewer().find('[data-key="NljCybzY4GmNGx-u2Xoo-Q"]').click();

        // Marker is updated to match new street view position.
        // expectMapAndMarkerCenter(51.91073083283029, 4.482760320410177);
    });
});
