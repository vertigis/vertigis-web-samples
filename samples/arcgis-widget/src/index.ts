import { LibraryRegistry } from "@vertigis/web/config";
import Daylight, { DaylightModel } from "./components/Daylight";

export default function registerLibrary(registry: LibraryRegistry): void {
    registry.registerComponent({
        name: "daylight",
        namespace: "your.custom.namespace",
        getComponentType: () => Daylight,
        itemType: "daylight",
        title: "Daylight",
    });
    registry.registerModel({
        getModel: (config) => new DaylightModel(config),
        itemType: "daylight",
    });
}
