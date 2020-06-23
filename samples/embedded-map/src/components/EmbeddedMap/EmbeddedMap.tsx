import React, { useEffect } from "react";
import {
    LayoutElement,
    LayoutElementProperties,
} from "@vertigis/web/components";
// import "mapillary-js/dist/mapillary.min.css";
import EmbeddedMapModel from "./EmbeddedMapModel";
import "./EmbeddedMap.css";
import { useWatchAndRerender } from "@vertigis/web/ui";

export default function EmbeddedMap(
    props: LayoutElementProperties<EmbeddedMapModel>
) {
    const { model } = props;

    useWatchAndRerender(model, "map");

    useEffect(() => {
        if (!model.map) {
            return;
        }

        const styles = document.createElement("link");
        styles.href =
            "https://unpkg.com/mapillary-js@2.20.0/dist/mapillary.min.css";
        styles.rel = "stylesheet";
        document.head.appendChild(styles);

        // Trigger render on browser window resize
        const resizeHandler = () => {
            model.resize();
        };
        window.addEventListener("resize", resizeHandler);

        (async () => {
            await model.initializeEmbeddedMap();
        })();

        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    }, [model]);

    return (
        <LayoutElement {...props} stretch>
            <div id={model.id} className="EmbeddedMap-map-container"></div>
        </LayoutElement>
    );
}
