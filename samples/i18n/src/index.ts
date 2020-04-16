import { LibraryRegistry } from "@geocortex/web/config";
import { ComponentType } from "react";
import TranslatableText, {
    TranslatableTextModel,
} from "./components/TranslatableText";
import enLanguageValues from "./en.json";
import deLanguageValues from "./de.json";

export default function (registry: LibraryRegistry) {
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
        getComponentType: () => TranslatableText as ComponentType,
        itemType: "translatable-text",
        title: "Translatable Text",
    });
    registry.registerModel({
        getModelType: () => TranslatableTextModel,
        itemType: "translatable-text",
    });
}
