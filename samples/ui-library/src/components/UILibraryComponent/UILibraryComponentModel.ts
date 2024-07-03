import type { ComponentModelProperties } from "@vertigis/web/models";
import { ComponentModelBase, serializable } from "@vertigis/web/models";

@serializable
export default class UILibraryComponentModel extends ComponentModelBase<ComponentModelProperties> {}
