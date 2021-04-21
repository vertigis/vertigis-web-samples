declare namespace Cypress {
    interface Chainable<Subject> {
        /**
         * Click an area on the map. Must be preceded with `getMap()`
         */
        clickMap(x: number, y: number): Chainable<JQuery<HTMLDivElement>>;
        /**
         * Get the root element of the map component.
         * If no `id` is specified, it will return the first map.
         */
        getMap(id?: string): Chainable<JQuery<HTMLDivElement>>;
        /**
         * Get the `body` element from the viewer `iframe` when nested within a
         * parent iframe.
         */
        getNestedViewer(): Chainable<JQuery<HTMLBodyElement>>;
        /**
         * Get the `body` element from the viewer `iframe`.
         */
        getViewer(): Chainable<JQuery<HTMLBodyElement>>;
        /**
         * Get the `body` element from the parent `iframe` of the viewer.
         */
        getViewerParent(): Chainable<JQuery<HTMLBodyElement>>;
    }
}
