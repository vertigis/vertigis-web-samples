import type { LibraryRegistry } from "@vertigis/web/config";

import ThreeDimensionalGraph, {
    ThreeDimensionalGraphModel,
} from "./components/ThreeDimensionalGraph";

export default function (registry: LibraryRegistry): void {
    registry.registerComponent({
        name: "three-dimensional-graph",
        namespace: "your.custom.namespace",
        getComponentType: () => ThreeDimensionalGraph,
        itemType: "three-dimensional-graph",
        title: "3D Graph",
    });
    registry.registerModel({
        getModel: (properties) => new ThreeDimensionalGraphModel(properties),
        itemType: "three-dimensional-graph",
    });
    registry.registerCommand({
        name: "three-dimensional-graph.display",
        itemType: "three-dimensional-graph",
    });
}
