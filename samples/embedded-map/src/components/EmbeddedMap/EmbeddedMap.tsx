import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Viewer, TransitionMode } from "mapillary-js";
import {
    LayoutElement,
    LayoutElementProperties,
} from "@vertigis/web/components";
import IconButton from "@vertigis/web/ui/IconButton";
import Sync from "@vertigis/web/ui/icons/Sync";
import CenterMap from "@vertigis/web/ui/icons/CenterMap";

// Import the necessary CSS for the Mapillary viewer to be styled correctly.
import "mapillary-js/dist/mapillary.min.css";
import EmbeddedMapModel from "./EmbeddedMapModel";
import "./EmbeddedMap.css";

declare const ResizeObserver;

export default function EmbeddedMap(
    props: LayoutElementProperties<EmbeddedMapModel>
): React.ReactElement {
    const { model } = props;
    const mlyRootEl = useRef<HTMLDivElement>();
    const [sync, setSync] = useState(model.syncGcxMap);

    const onSyncToggle = () => {
        model.syncGcxMap = !model.syncGcxMap;
        setSync(model.syncGcxMap);
    };

    const onRecenter = () => {
        void model.recenter();
    };

    useEffect(() => {
        const mapillary = new Viewer(mlyRootEl.current, model.mapillaryKey);
        mapillary.setTransitionMode(TransitionMode.Instantaneous);
        model.mapillary = mapillary;

        const handleViewportResize = () => {
            mapillary.resize();
        };

        // Viewer size is dynamic so resize should be called every time the viewport size changes.
        const resizeObserver = new ResizeObserver(handleViewportResize);
        const viewportDiv = mlyRootEl.current.parentElement;
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
        <div className={"gcx-component gcx-stretchy"}>
            <div className="EmbeddedMap-ui-container">
                <IconButton
                    className={clsx(
                        "EmbeddedMap-button",
                        "EmbeddedMap-sync-button",
                        { selected: sync }
                    )}
                    onClick={onSyncToggle}
                >
                    <Sync color={sync ? "primary" : "secondary"} />
                </IconButton>
                <IconButton
                    className="EmbeddedMap-button EmbeddedMap-recenter-button"
                    onClick={onRecenter}
                >
                    <CenterMap />
                </IconButton>
            </div>
            <LayoutElement {...props}>
                <div ref={mlyRootEl} />
            </LayoutElement>
        </div>
    );
}
