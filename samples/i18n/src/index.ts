import type { LibraryRegistry } from "@vertigis/web/config";

import TranslatableText, {
    TranslatableTextModel,
} from "./components/TranslatableText";
import deLanguageValues from "./de.json";
import enLanguageValues from "./en.json";

export default function registerLibrary(registry: LibraryRegistry): void {
    registry.registerLanguageResources({
        locale: "en",
        getValues: () => enLanguageValues,
    });
    registry.registerLanguageResources({
        locale: "de",
        getValues: () => deLanguageValues,
    });

    registry.registerComponent({
        name: "translatable-text",
        namespace: "your.custom.namespace",
        getComponentType: () => TranslatableText,
        itemType: "translatable-text",
        title: "Translatable Text",
    });
    registry.registerModel({
        getModel: () => new TranslatableTextModel(),
        itemType: "translatable-text",
    });
}
