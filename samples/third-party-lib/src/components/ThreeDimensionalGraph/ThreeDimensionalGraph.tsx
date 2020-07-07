import React, { useRef } from "react";
import {
    LayoutElement,
    LayoutElementProperties,
} from "@vertigis/web/components";
import { useWatch, useWatchAndRerender } from "@vertigis/web/ui";
import { ForceGraph3D } from "react-force-graph";
import ThreeDimensionalGraphModel from "./ThreeDimensionalGraphModel";
import useDimensions from "./useDimensions";
import "./ThreeDimensionalGraph.css";

export default function ThreeDimensionalGraph(
    props: LayoutElementProperties<ThreeDimensionalGraphModel>
): React.ReactElement {
    const { model } = props;
    const [rootRef, rootDimensions] = useDimensions<HTMLDivElement>();
    const graphRef: React.ComponentProps<typeof ForceGraph3D>["ref"] = useRef();

    useWatchAndRerender(model, "graphData");
    // Force the nodes/links to re-render when the selected survey changes. This
    // will make sure the node color is correct.
    useWatch(model, "selectedSurveyId", () => graphRef.current.refresh());

    const bgColor =
        model.brandingService?.activeTheme.colors
            .get("primaryBackground")
            .toHex() ?? "black";
    const fgColor =
        model.brandingService?.activeTheme.colors
            .get("primaryForeground")
            .toHex() ?? "white";

    return (
        <LayoutElement {...props} stretch>
            <div ref={rootRef} className="ThreeDimensionalGraph">
                <ForceGraph3D
                    ref={graphRef}
                    backgroundColor={bgColor}
                    graphData={model.graphData}
                    linkColor={fgColor}
                    width={rootDimensions?.width}
                    height={rootDimensions?.height}
                    // We've extended the properties of the `NodeObject`. We
                    // need to cast to keep TypeScript happy.
                    nodeColor={model.getNodeColor as any}
                    nodeLabel={model.getNodeLabel as any}
                    onNodeClick={model.handleNodeClick as any}
                    onNodeHover={model.handleNodeHover as any}
                />
            </div>
        </LayoutElement>
    );
}
