import { ComponentModelBase, serializable } from "@vertigis/web/models";
import { FrameworkServiceType, inject } from "@vertigis/web/services";
import type { IconRegistry } from "@vertigis/web/ui/icons";

@serializable
export default class IconListModel extends ComponentModelBase {
    @inject(FrameworkServiceType.ICON_REGISTRY)
    imageRegistry: IconRegistry;

    get iconNames(): string[] {
        return [...this.imageRegistry.keys()];
    }
}
