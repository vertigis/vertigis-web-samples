import type { MapModel } from "@vertigis/web/mapping/MapModel";
import type {
    ComponentModelProperties,
    PropertyDefs,
} from "@vertigis/web/models";
import {
    ComponentModelBase,
    importModel,
    serializable,
} from "@vertigis/web/models";

export interface DaylightModelProperties extends ComponentModelProperties {
    dateOrSeason?: "season" | "date";
}

@serializable
export default class DaylightModel extends ComponentModelBase<DaylightModelProperties> {
    @importModel("map-extension")
    map: MapModel | undefined;

    dateOrSeason: DaylightModelProperties["dateOrSeason"];

    protected override _getSerializableProperties(): PropertyDefs<DaylightModelProperties> {
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
