import { LibraryRegistry } from "@vertigis/web/config";
import UILibraryComponent, {
    UILibraryComponentModel,
} from "./components/UILibraryComponent";

export default function (registry: LibraryRegistry) {
    registry.registerComponent({
        name: "ui-library",
        namespace: "your.custom.namespace",
        getComponentType: () => UILibraryComponent as any,
        itemType: "ui-library",
        title: "UI Library",
    });
    registry.registerModel({
        getModel: (config) => new UILibraryComponentModel(config),
        itemType: "ui-library",
    });
}
