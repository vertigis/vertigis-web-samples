import { getMapOrSceneView } from "../mapUtils";

const sampleName = "embedded-map";

// Although we provide the exact number from the street view position when
// setting the location marker and map center positions, the actual position of
// the map and marker won't be exact.
const numberPrecision = 1e-6;

const expectMarkerCenter = (lat: number, lon: number) =>
    cy
        .getViewer()
        .getMap()
        .should((mapEl) => {
            const mapView = getMapOrSceneView(mapEl);

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

        // Marker is set initially to match street view position.
        expectMarkerCenter(51.91079805555349, 4.4827030555555485);

        // Find the forward arrow by querying for the mapillary node id that
        // represents the next node in the forward direction.
        cy.getViewer().find('[data-key="NljCybzY4GmNGx-u2Xoo-Q"]').click();

        // Marker is updated to match new street view position.
        expectMarkerCenter(51.91076853799338, 4.482757781374804);
    });
});
