import { LibraryRegistry } from "@vertigis/web/config";
import EmbeddedMap, {
    ThreeDimensionalGraphModel,
} from "./components/ThreeDimensionalGraph";

export default function (registry: LibraryRegistry): void {
    registry.registerComponent({
        name: "three-dimensional-graph",
        namespace: "your.custom.namespace",
        getComponentType: () => EmbeddedMap,
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
