const sampleName = "i18n";

// const getWrapperIframeDocument = () => {
//     return (
//         cy
//             .get('iframe[data-cy="viewer-wrapper-frame"]')
//             // Cypress yields jQuery element, which has the real
//             // DOM element under property "0".
//             // From the real DOM iframe element we can get
//             // the "document" element, it is stored in "contentDocument" property
//             // Cypress "its" command can access deep properties using dot notation
//             // https://on.cypress.io/its
//             .its("0.contentDocument")
//             .should("exist")
//     );
// };

// const getWrapperIframeBody = () => {
//     // get the document
//     return (
//         getWrapperIframeDocument()
//             // automatically retries until body is loaded
//             .its("body")
//             .should("not.be.undefined")
//             // wraps "body" DOM element to allow
//             // chaining more Cypress commands, like ".find(...)"
//             .then(cy.wrap)
//     );
// };

// const getIframeDocument = () => {
//     const wrapperBody = getWrapperIframeBody();
//     return (
//         wrapperBody
//             .get('iframe[data-cy="viewer-frame"]')
//             // Cypress yields jQuery element, which has the real
//             // DOM element under property "0".
//             // From the real DOM iframe element we can get
//             // the "document" element, it is stored in "contentDocument" property
//             // Cypress "its" command can access deep properties using dot notation
//             // https://on.cypress.io/its
//             .its("0.contentDocument")
//             .should("exist")
//     );
// };

// const getIframeBody = () => {
//     // get the document
//     return (
//         getIframeDocument()
//             // automatically retries until body is loaded
//             .its("body")
//             .should("not.be.undefined")
//             // wraps "body" DOM element to allow
//             // chaining more Cypress commands, like ".find(...)"
//             .then(cy.wrap)
//     );
// };

// const getWrapperIframeBody = () => {
//     // get the iframe > document > body
//     // and retry until the body element is not empty
//     return (
//         cy
//             .get('iframe[data-cy="viewer-wrapper-frame"]')
//             .its("0.contentDocument.body")
//             .should("not.be.empty")
//             // wraps "body" DOM element to allow
//             // chaining more Cypress commands, like ".find(...)"
//             // https://on.cypress.io/wrap
//             .then(cy.wrap)
//     );
// };

// const getIframeBody = () => {
//     // get the iframe > document > body
//     // and retry until the body element is not empty
//     return (
//         getWrapperIframeBody()
//             .get("iframe")
//             .pause()
//             .its("0.contentDocument.body")
//             .should("not.be.empty")
//             // wraps "body" DOM element to allow
//             // chaining more Cypress commands, like ".find(...)"
//             // https://on.cypress.io/wrap
//             .then(cy.wrap)
//     );
// };

const getViewer = () => {
    return (
        cy
            // .frameLoaded('iframe[data-cy="viewer-wrapper-frame"]')
            // .iframe('iframe[data-cy="viewer-wrapper-frame"]')
            .frameLoaded('iframe[data-cy="viewer-frame"]')
            .iframe('iframe[data-cy="viewer-frame"]')
    );
};

describe(sampleName, () => {
    it("shows english text", () => {
        cy.visit("http://localhost:3000/");

        getViewer().contains("I will be translated.").should("be.visible");
    });

    it("shows german text", () => {
        cy.visit("http://localhost:3000/?locale=de");

        getViewer()
            .contains("Dieser Text wird übersetzt.")
            .should("be.visible");
    });
});
