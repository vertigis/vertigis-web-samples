import { command } from "@vertigis/web/messaging";
import {
    ComponentModelBase,
    serializable,
    type ComponentModelProperties,
} from "@vertigis/web/models";

import type { LibraryConfig } from "../LibraryViewer/LibraryViewerModel";

export interface SetLibraryArgs {
    libraries: LibraryConfig[];
    selectedLibrary: string;
}

@serializable
export default class PickListModel extends ComponentModelBase<ComponentModelProperties> {
    libraries: LibraryConfig[];
    selectedLibrary: string;

    @command("library-viewer.set-libraries")
    protected _executeSetLibraries({ libraries, selectedLibrary }): void {
        this.libraries = libraries;
        this.selectedLibrary = selectedLibrary;
    }
}
