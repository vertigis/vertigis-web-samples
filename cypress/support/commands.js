// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("getViewer", { prevSubject: "optional" }, (subject) =>
    (
        (subject &&
            cy
                .wrap(subject)
                .find('iframe[data-cy="viewer-frame"]', { log: false })) ||
        cy.get('iframe[data-cy="viewer-frame"]', { log: false })
    )
        .its("0.contentDocument.body", { log: false })
        .should("not.be.empty")
        .then((result) => cy.wrap(result, { log: false }))
);

Cypress.Commands.add("getViewerParent", () =>
    cy
        .get('iframe[data-cy="viewer-outer-frame"]', { log: false })
        .its("0.contentDocument.body", { log: false })
        .should("not.be.empty")
        .then((subject) => cy.wrap(subject, { log: false }))
);

Cypress.Commands.add("getNestedViewer", () => cy.getViewerParent().getViewer());

Cypress.Commands.add("getMap", { prevSubject: "element" }, (subject, id) => {
    const selector = id ? `[gcx-id="${id}"]` : ".gcx-map";

    return cy
        .wrap(subject)
        .find(selector, { timeout: 30000 })
        .should("exist")
        .and((el) => {
            const mapId = el[0].getAttribute("gcx-id");
            const win = el[0].ownerDocument?.defaultView;

            // Wait for global map data to be available once initialized
            expect(win.__maps?.[mapId] || win.__scenes?.[mapId]).to.be.ok;
        });
});
