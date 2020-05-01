declare namespace Cypress {
    interface Chainable<Subject> {
        /**
         * Get the `body` element from the viewer `iframe`.
         */
        getViewer(): Chainable<JQuery<HTMLBodyElement>>;
    }
}
