import React, { useEffect } from "react";
import {
    LayoutElement,
    LayoutElementProperties,
} from "@vertigis/web/components";
import EmbeddedMapModel from "./EmbeddedMapModel";
import { useWatchAndRerender } from "@vertigis/web/ui";
// Import the necessary CSS for the Mapillary viewer to be styled correctly.
import "mapillary-js/dist/mapillary.min.css";

export default function EmbeddedMap(
    props: LayoutElementProperties<EmbeddedMapModel>
): React.ReactElement {
    const { model } = props;
    const { initializeEmbeddedMap, destroyEmbeddedMap, map } = model;

    useWatchAndRerender(model, "map");

    useEffect(() => {
        if (!map) {
            return;
        }
        // We initialize from here as we need to ensure the HTML element is in
        // the DOM before initializing the embedded map.
        void (async () => {
            await initializeEmbeddedMap();
        })();

        // Clean up when this component is unmounted from the DOM.
        return () => destroyEmbeddedMap();
    }, [initializeEmbeddedMap, destroyEmbeddedMap, map]);

    return (
        <LayoutElement {...props} stretch>
            <div id={model.id} className="EmbeddedMap-map-container"></div>
        </LayoutElement>
    );
}