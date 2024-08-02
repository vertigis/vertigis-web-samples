import { expectMapToBeStationary, getCurrentViewpoint } from "../mapUtils";

const sampleName = "iframe";

// Temporarily skipped until we can figure out why the web scene isn't loading
// on the github build agent.
xdescribe(sampleName, () => {
    it("sends message from parent to viewer and from viewer to parent", () => {
        cy.visit(`http://localhost:3001/#${sampleName}`);

        // Close the licensing alert
        cy.getViewer().find(`button[title="Close"]`).click();

        cy.getEmbeddedViewer()
            .getMap()
            .should((map) => {
                expectMapToBeStationary(map);
                const viewpoint = getCurrentViewpoint(map);
                expect(viewpoint.camera.position.z).not.to.equal(-250);
            });

        cy.getEmbeddedViewerHost().contains("button", "Go!").click();

        cy.getEmbeddedViewer()
            .getMap()
            .should((map) => {
                expectMapToBeStationary(map);
                const viewpoint = getCurrentViewpoint(map);
                expect(viewpoint.camera.position.z).to.equal(-250);
            });

        cy.getEmbeddedViewerHost()
            .contains("button", "Zoom to initial viewpoint")
            .click();

        cy.getEmbeddedViewer()
            .getMap()
            .should((map) => {
                expectMapToBeStationary(map);
                const viewpoint = getCurrentViewpoint(map);
                expect(viewpoint.camera.position.z).not.to.equal(-250);
            });

        cy.getEmbeddedViewer()
            .contains("button", "Send message to parent")
            .click();

        cy.getEmbeddedViewer()
            .contains('[role="dialog"]', "Enter the message")
            .find("input")
            .type("Hello world");

        cy.getEmbeddedViewer()
            .contains('[role="dialog"]', "Enter the message")
            .contains("button", "OK")
            .click();

        cy.getEmbeddedViewerHost().contains("Hello world");
    });
});
