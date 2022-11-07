import {
    ComponentModelBase,
    ComponentModelProperties,
    importModel,
    PropertyDefs,
    serializable,
} from "@vertigis/web/models";
import { MapModel } from "@vertigis/web/mapping/MapModel";

export interface DaylightModelProperties extends ComponentModelProperties {
    dateOrSeason?: "season" | "date";
}

@serializable
export default class DaylightModel extends ComponentModelBase<DaylightModelProperties> {
    @importModel("map-extension")
    map: MapModel | undefined;

    dateOrSeason: DaylightModelProperties["dateOrSeason"];

    protected _getSerializableProperties(): PropertyDefs<DaylightModelProperties> {
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
