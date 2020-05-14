import { LibraryRegistry } from "@geocortex/web/config";
import BasicComponent, {
    BasicComponentModel,
} from "./components/BasicComponent";

export default function (registry: LibraryRegistry) {
    registry.registerComponent({
        name: "basic",
        namespace: "your.custom.namespace",
        getComponentType: () => BasicComponent as any,
        itemType: "basic",
        title: "Basic",
    });
    registry.registerModel({
        getModelType: () => BasicComponentModel,
        itemType: "basic",
    });
}
