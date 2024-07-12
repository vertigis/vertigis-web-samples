declare namespace Cypress {
    interface Chainable<Subject> {
        getMap(id?: string): Chainable<JQuery<HTMLDivElement>>;
        /**
         * Get the `body` element from the embedded viewer `iframe`.
         */
        getEmbeddedViewer(): Chainable<JQuery<HTMLBodyElement>>;
        /**
         * Get the `body` element from the library viewer `iframe`.
         */
        getViewer(): Chainable<JQuery<HTMLBodyElement>>;
        /**
         * Get the `body` element from the host `iframe` for the embedded viewer.
         */
        getEmbeddedViewerHost(): Chainable<JQuery<HTMLBodyElement>>;
    }
}
