import React from "react";
import {
    LayoutElement,
    LayoutElementProperties,
} from "@vertigis/web/components";
import { ForceGraph3D } from "react-force-graph";
import EmbeddedMapModel from "./ThreeDimensionalGraphModel";
import { useWatchAndRerender } from "@vertigis/web/ui";

export default function ThreeDimensionalGraph(
    props: LayoutElementProperties<EmbeddedMapModel>
): React.ReactElement {
    const { model } = props;

    useWatchAndRerender(model, "graphData");

    return (
        <LayoutElement {...props} stretch>
            <div>
                <ForceGraph3D
                    graphData={model.graphData}
                    nodeLabel="id"
                    width={500}
                    height={500}
                />
            </div>
        </LayoutElement>
    );
}
