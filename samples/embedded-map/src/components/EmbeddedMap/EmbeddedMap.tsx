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
        <>
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
            <LayoutElement {...props} stretch>
                <div
                    ref={mlyRootEl}
                    className="EmbeddedMap-map-container"
                ></div>
            </LayoutElement>
        </>
    );
}
