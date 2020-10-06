import { getMapOrSceneView } from "../mapUtils";

const sampleName = "embedded-map";

// Although we provide the exact number from the street view position when
// setting the location marker and map center positions, the actual position of
// the map and marker won't be exact.
const numberPrecision = 1e-5;

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

        // The following test depends on the web scene being used and the current
        // state of the mapillary database. 

        // Marker is set initially to match street view position.
        expectMapAndMarkerCenter(51.908070806028164, 4.486175772780554);

        // Find the forward arrow by querying for the mapillary node id that
        // represents the next node in the forward direction.
        cy.getViewer().find('[data-key="f_wCfca88pFHl-CM1EKtLg"]').click();

        // Marker is updated to match new street view position.
        expectMapAndMarkerCenter(51.908175485049426, 4.4862970380600515);
    });
});
