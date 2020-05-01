const sampleName = "commands-and-operations";

const openIwtm = () =>
    cy.getViewer().find("button").contains("Execute Custom Behavior").click();

const clickMenuItem = (menuItemText: string) =>
    cy.getViewer().find('[role="menuitem"]').contains(menuItemText).click();

describe(sampleName, () => {
    it("executes commands and operations", () => {
        cy.visit(`http://localhost:3000/${sampleName}`);

        openIwtm();
        clickMenuItem("Run Command 1");
        openIwtm();
        clickMenuItem("Run Command 2");
        openIwtm();
        clickMenuItem("View Command History");

        cy.getViewer()
            .find('[role="alertdialog"]')
            .contains(
                `[ "Never Gonna Give You Up", "Never Gonna Let You Down" ]`
            )
            .should("be.visible");
    });
});

export {};
