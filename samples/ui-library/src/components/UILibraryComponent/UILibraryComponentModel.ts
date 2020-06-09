import {
    ComponentModelBase,
    ComponentModelProperties,
    serializable,
} from "@vertigis/web/models";

interface UILibraryComponentModelProperties extends ComponentModelProperties {}

@serializable
export default class UILibraryComponentModel extends ComponentModelBase<
    UILibraryComponentModelProperties
> {}
