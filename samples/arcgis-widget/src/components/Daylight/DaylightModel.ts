import {
    ComponentModelBase,
    ComponentModelProperties,
    importModel,
    serializable,
} from "@vertigis/web/models";
import { ItemType } from "@vertigis/arcgis-extensions/ItemType";

@serializable
export default class DaylightModel extends ComponentModelBase<
    ComponentModelProperties
> {
    // TODO: Use correct type for `map` after 5.10 release.
    @importModel(ItemType.MAP_EXTENSION)
    map: any | undefined;
}
