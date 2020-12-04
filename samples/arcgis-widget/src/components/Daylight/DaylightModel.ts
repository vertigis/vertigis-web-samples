import {
    ComponentModelBase,
    ComponentModelProperties,
    importModel,
    PropertyDefs,
    serializable,
} from "@vertigis/web/models";
import { ItemType } from "@vertigis/arcgis-extensions/ItemType";

export interface DaylightModelProperties extends ComponentModelProperties {
    dateOrSeason?: "season" | "date";
}

@serializable
export default class DaylightModel extends ComponentModelBase<
    DaylightModelProperties
> {
    // TODO: Use correct type for `map` after 5.10 release.
    @importModel(ItemType.MAP_EXTENSION)
    map: any | undefined;

    dateOrSeason: DaylightModelProperties["dateOrSeason"];

    protected _getSerializableProperties(): PropertyDefs<
        DaylightModelProperties
    > {
        const baseProperties = super._getSerializableProperties();
        return {
            ...baseProperties,
            dateOrSeason: {
                serializeModes: ["initial"],
                default: "date",
            },
        };
    }
}
