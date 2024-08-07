import type { LibraryRegistry } from "@vertigis/web/config";

import { registerIcons } from "./_support/registerIcons";
import IconList, { IconListModel } from "./components/IconList";
// This import is auto-generated when you install packages or run 'yarn
// prepare'.

export default function registerLibrary(registry: LibraryRegistry): void {
    registry.registerComponent({
        name: "icon-list",
        namespace: "your.custom.namespace",
        getComponentType: () => IconList,
        itemType: "icon-list",
        title: "Icon List",
    });
    registry.registerModel({
        getModel: () => new IconListModel(),
        itemType: "icon-list",
    });

    // Register our Icon Pack
    registerIcons(registry);
}
