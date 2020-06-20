import React, { useEffect, useRef, useState } from "react";
import { LayoutElement } from "@vertigis/web/components";
import { generateUuid } from "@vertigis/arcgis-extensions/utilities/uuid";
import { Viewer } from "mapillary-js/";
// import "mapillary-js/dist/mapillary.min.css";
import "./EmbeddedMap.css";

export default function EmbeddedMap(props) {
    const [hostElementId] = useState(generateUuid());
    const mapillaryInstance = useRef();

    useEffect(() => {
        const styles = document.createElement("link");
        styles.href =
            "https://unpkg.com/mapillary-js@2.20.0/dist/mapillary.min.css";
        styles.rel = "stylesheet";
        document.head.appendChild(styles);

        mapillaryInstance.current = new Viewer(
            hostElementId,
            "QjI1NnU0aG5FZFZISE56U3R5aWN4Zzo3NTM1MjI5MmRjODZlMzc0",
            "zarcRdNFZwg3FkXNcsFeGw"
        );
    }, [hostElementId]);

    return (
        <LayoutElement {...props} stretch>
            Map goes here
            <div id={hostElementId} className="EmbeddedMap-map-container"></div>
        </LayoutElement>
    );
}
