import { getMapOrSceneView } from "../mapUtils";

const sampleName = "embedded-map";

// Although we provide the exact number from the street view position when
// setting the location marker and map center positions, the actual position of
// the map and marker won't be exact.
const numberPrecision = 1e-10;

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
    it("synchronizes map and marker position with street view position", () => {
        cy.visit(`http://localhost:3000/${sampleName}`);

        // Center is set initially to match street view position.
        expectMapAndMarkerCenter(51.91075394724828, 4.482735763121212);

        // There isn't a great way to find the "up" arrow.
        // However, it's always in the same location in the DOM.
        cy.getViewer().find(".DirectionsCircle").eq(2).click();

        // Center is updated to match new street view position.
        expectMapAndMarkerCenter(51.91071168256558, 4.482791490528446);
    });
});
