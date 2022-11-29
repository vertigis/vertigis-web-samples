import { expectMapToBeStationary, getCurrentViewpoint } from "../mapUtils";

const sampleName = "iframe";

// Temporarily skipped until we can figure out why the web scene isn't loading
// on the github build agent.
xdescribe(sampleName, () => {
    it("sends message from parent to viewer and from viewer to parent", () => {
        cy.visit(sampleName);

        // Close the licensing alert
        cy.getNestedViewer().find(`button[title="Close"]`).click();

        cy.getNestedViewer()
            .getMap()
            .should((map) => {
                expectMapToBeStationary(map);
                const viewpoint = getCurrentViewpoint(map);
                expect(viewpoint.camera.position.z).not.to.equal(-250);
            });

        cy.getViewerParent().contains("button", "Go!").click();

        cy.getNestedViewer()
            .getMap()
            .should((map) => {
                expectMapToBeStationary(map);
                const viewpoint = getCurrentViewpoint(map);
                expect(viewpoint.camera.position.z).to.equal(-250);
            });

        cy.getViewerParent()
            .contains("button", "Zoom to initial viewpoint")
            .click();

        cy.getNestedViewer()
            .getMap()
            .should((map) => {
                expectMapToBeStationary(map);
                const viewpoint = getCurrentViewpoint(map);
                expect(viewpoint.camera.position.z).not.to.equal(-250);
            });

        cy.getNestedViewer()
            .contains("button", "Send message to parent")
            .click();

        cy.getNestedViewer()
            .contains('[role="dialog"]', "Enter the message")
            .find("input")
            .type("Hello world");

        cy.getNestedViewer()
            .contains('[role="dialog"]', "Enter the message")
            .contains("button", "OK")
            .click();

        cy.getViewerParent().contains("Hello world");
    });
});
