import type { LibraryRegistry } from "@vertigis/web/config";

import BasicComponent, {
    BasicComponentModel,
} from "./components/BasicComponent";

export default function registerLibrary(registry: LibraryRegistry): void {
    registry.registerComponent({
        name: "basic",
        namespace: "your.custom.namespace",
        getComponentType: () => BasicComponent,
        itemType: "basic",
        title: "Basic",
    });
    registry.registerModel({
        getModel: (config) => new BasicComponentModel(config),
        itemType: "basic",
    });
}
