import React, { useCallback, useLayoutEffect, useState } from "react";
import {
    LayoutElement,
    LayoutElementProperties,
} from "@vertigis/web/components";
import { useWatchAndRerender } from "@vertigis/web/ui";
import { ForceGraph3D } from "react-force-graph";
import EmbeddedMapModel, { NodeObject } from "./ThreeDimensionalGraphModel";
import "./ThreeDimensionalGraph.css";

export default function ThreeDimensionalGraph(
    props: LayoutElementProperties<EmbeddedMapModel>
): React.ReactElement {
    const { model } = props;
    const [rootRef, rootDimensions] = useDimensions<HTMLDivElement>();

    useWatchAndRerender(model, "graphData");

    return (
        <LayoutElement {...props} stretch>
            <div ref={rootRef} className="ThreeDimensionalGraph">
                <ForceGraph3D
                    graphData={model.graphData}
                    nodeColor={(node: NodeObject) => {
                        if (node.type === "surveyor") {
                            return "white";
                        }

                        if (node.result === "FAIL") {
                            return "red";
                        }

                        return "green";
                    }}
                    nodeLabel={(node: NodeObject) => {
                        if (node.type === "surveyor") {
                            return `Surveyor: ${node.id}`;
                        }

                        return `${node.hydrantNum} - ${
                            node.result
                        } - ${new Date(node.date).toString()}`;
                    }}
                    onNodeClick={(node: NodeObject) =>
                        model.handleNodeClick(node)
                    }
                    onNodeHover={(node: NodeObject) =>
                        model.handleNodeHover(node)
                    }
                    width={rootDimensions?.width}
                    height={rootDimensions?.height}
                />
            </div>
        </LayoutElement>
    );
}

type UseDimensionsHook<T = HTMLElement> = [
    (node: T) => void,
    DOMRect | undefined,
    T
];

function useDimensions<T>(): UseDimensionsHook<T> {
    const [dimensions, setDimensions] = useState<DOMRect>();
    const [node, setNode] = useState(null);

    const ref = useCallback((node) => {
        setNode(node);
    }, []);

    useLayoutEffect(() => {
        if (node) {
            const measure = () => setDimensions(node.getBoundingClientRect());
            measure();

            const resizeObserver = new ResizeObserver(() => measure());
            resizeObserver.observe(node);

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [node]);

    return [ref, dimensions, node];
}
