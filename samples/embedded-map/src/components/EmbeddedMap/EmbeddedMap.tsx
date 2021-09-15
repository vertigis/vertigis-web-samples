import { ReactElement, useEffect, useRef } from "react";
import { Viewer, TransitionMode } from "mapillary-js";
import {
    LayoutElement,
    LayoutElementProperties,
} from "@vertigis/web/components";

// Import the necessary CSS for the Mapillary viewer to be styled correctly.
import "mapillary-js/dist/mapillary.css";
import EmbeddedMapModel from "./EmbeddedMapModel";

// This line should be removed when this issue is resolved:
// https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/908
declare const ResizeObserver;

export default function EmbeddedMap(
    props: LayoutElementProperties<EmbeddedMapModel>
): ReactElement {
    const { model } = props;
    const mlyRootEl = useRef<HTMLDivElement>();

    useEffect(() => {
        const mapillary = new Viewer({
            imageId: "2935399116683438",
            accessToken: model.mapillaryKey,
            container: mlyRootEl.current,
            component: {
                // Initialize the view immediately without user interaction.
                cover: false,
            },
            transitionMode: TransitionMode.Instantaneous,
        });
        model.mapillary = mapillary;

        const handleViewportResize = () => {
            mapillary.resize();
        };

        // Viewer size is dynamic so resize should be called every time the viewport size changes.
        const resizeObserver = new ResizeObserver(handleViewportResize);
        const viewportDiv = mlyRootEl.current;
        resizeObserver.observe(viewportDiv);

        // Clean up when this component is unmounted from the DOM.
        return () => {
            resizeObserver.unobserve(viewportDiv);
            // Clear out the Mapillary instance property. This will take care of
            // cleaning up.
            model.mapillary = undefined;
        };
    }, [model, model.id, model.mapillaryKey]);

    return (
        <LayoutElement {...props} stretch>
            <div ref={mlyRootEl} className="EmbeddedMap-map-container"></div>
        </LayoutElement>
    );
}
