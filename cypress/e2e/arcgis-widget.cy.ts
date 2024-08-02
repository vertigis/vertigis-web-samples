import { getMapOrSceneView } from "../mapUtils";

const sampleName = "arcgis-widget";

const expectLightingDate = (isoDate: string) =>
    cy
        .getViewer()
        .getMap()
        .should((mapEl) => {
            const mapView = getMapOrSceneView(mapEl);
            expect(mapView.environment.lighting.date.toISOString()).to.equal(
                isoDate
            );
        });

const findWidgetSelect = () =>
    cy
        .getViewer()
        .getMap()
        .find(".esri-daylight__season-picker")
        .shadow()
        .find('select[aria-label="Season"]');

// Temporarily skipped until we can figure out why the web scene isn't loading
// on the github build agent.
xdescribe(sampleName, () => {
    it("has the widget connected to the scene view", () => {
        cy.visit(`http://localhost:3001/#${sampleName}`);

        // Close the licensing alert
        cy.getViewer().find(`button[title="Close"]`).click();

        findWidgetSelect().select("Summer");
        expectLightingDate("2015-06-21T11:42:01.000Z");

        findWidgetSelect().select("Winter");
        expectLightingDate("2015-12-21T11:42:01.000Z");
    });

    it("controls the widget state from the date mode select", () => {
        cy.visit(`http://localhost:3001/#${sampleName}`);

        // Close the licensing alert
        cy.getViewer().find(`button[title="Close"]`).click();

        // Should default to season mode.
        findWidgetSelect().should("have.value", "spring");

        // Our date picker mode select should control the widget.
        cy.getViewer()
            .contains("label", "Date Picker Mode")
            .parent()
            .find('[role="combobox"]')
            .click();
        cy.getViewer().contains('li[role="option"]', "Date").click();

        // Now should be in date mode.
        cy.getViewer()
            // Date pattern can be in a few different formats depending on locale.
            // `en-CA`, `en-US`, etc.
            .contains('[role="button"]', /2015-06-01|06\/01\/2015/)
            .should("exist");
    });
});

export {};
