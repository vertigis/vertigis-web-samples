import React, { useEffect } from "react";
import {
    LayoutElement,
    LayoutElementProperties,
} from "@vertigis/web/components";
import { Viewer } from "mapillary-js";
// Import the necessary CSS for the Mapillary viewer to be styled correctly.
import "mapillary-js/dist/mapillary.min.css";
import EmbeddedMapModel from "./EmbeddedMapModel";

export default function EmbeddedMap(
    props: LayoutElementProperties<EmbeddedMapModel>
): React.ReactElement {
    const { model } = props;

    useEffect(() => {
        const mapillary = new Viewer(
            model.id,
            model.mapillaryKey,
            // Mapillary node to start on.
            "gLV8Jn5A6b6rbVRy2xhkMA",
            {
                component: {
                    // Initialize the view immediately without user interaction.
                    cover: false,
                },
            }
        );
        model.mapillary = mapillary;

        const handleWindowResize = () => {
            mapillary.resize();
        };

        // Viewer size is dynamic so resize should be called every time the window size changes.
        window.addEventListener("resize", handleWindowResize);

        // Clean up when this component is unmounted from the DOM.
        return () => {
            window.removeEventListener("resize", handleWindowResize);
            // Clear out the Mapillary instance property. This will take care of
            // cleaning up.
            model.mapillary = undefined;
        };
    }, [model, model.id, model.mapillaryKey]);

    return (
        <LayoutElement {...props} stretch>
            <div id={model.id} className="EmbeddedMap-map-container"></div>
        </LayoutElement>
    );
}
