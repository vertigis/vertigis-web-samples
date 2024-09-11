import type { LayoutElementProperties } from "@vertigis/web/components";
import { LayoutElement } from "@vertigis/web/components";
import { useWatch, useWatchAndRerender } from "@vertigis/web/ui";
import { useRef } from "react";
import type { MutableRefObject, ReactElement } from "react";
import ForceGraph3D, { type ForceGraphMethods } from "react-force-graph-3d";

import type ThreeDimensionalGraphModel from "./ThreeDimensionalGraphModel";
import useDimensions from "./useDimensions";
import "./ThreeDimensionalGraph.css";

export default function ThreeDimensionalGraph(
    props: LayoutElementProperties<ThreeDimensionalGraphModel>
): ReactElement {
    const { model } = props;
    const [rootRef, rootDimensions] = useDimensions<HTMLDivElement>();
    const graphRef: MutableRefObject<ForceGraphMethods> = useRef();

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

    const { graphData } = model;

    return (
        <LayoutElement {...props} stretch>
            <div
                ref={rootRef}
                className="ThreeDimensionalGraph"
                // Keep track of node count to ease testing.
                data-node-count={graphData.nodes.length}
            >
                <ForceGraph3D
                    ref={graphRef}
                    backgroundColor={bgColor}
                    graphData={graphData}
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
