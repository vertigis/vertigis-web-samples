import type { AppConfig } from "@vertigis/web/AppConfig";
import type { AppContext } from "@vertigis/web/AppContext";
import type { Library } from "@vertigis/web/Application";
import type { LayoutXml } from "@vertigis/web/layout";
import { command } from "@vertigis/web/messaging";
import {
    type ComponentModelProperties,
    ComponentModelBase,
    serializable,
    type PropertyDefs,
} from "@vertigis/web/models";
import { inject, FrameworkServiceType } from "@vertigis/web/services";
import { Builder, parseStringPromise as parseString } from "xml2js";

import type { SetLibraryArgs } from "../PickList/PickListModel";

export interface LibraryConfig {
    /** The id of the library. This will be the name of the containing folder. */
    id: string;
    /** A human-readable title for the library. */
    title?: string;
    /**
     * Use a custom page containing an iframe to host the sample. Add a
     * `parent.html` to the `app` directory to use. Defaults to `false` (the
     * sample is hosted by the library viewer in the existing iframe).
     */
    useHostPage?: boolean;
}

export interface LibraryViewerModelProperties extends ComponentModelProperties {
    libraries?: LibraryConfig[];
}

@serializable
export default class LibraryViewerModel extends ComponentModelBase<LibraryViewerModelProperties> {
    @inject(FrameworkServiceType.APP_CONTEXT)
    appContext: AppContext;

    /**
     * Configuration for the libraries in this collection that you'd like to be
     * available through this viewer. The `id` is the name of a sibling folder
     * with a library in it, and the `name` is whatever you'd like to show up as
     * the title in the picklist.
     */
    libraries: LibraryConfig[];

    selectedLibrary: string;
    libraryUrl: string;
    hostPage: string;

    handleHostFrameLoaded: (iframe: HTMLIFrameElement) => void;

    protected override async _onInitialize(): Promise<void> {
        await super._onInitialize();

        this.selectedLibrary = parent.location.hash.substring(1);
        if (this.selectedLibrary === "") {
            this.selectedLibrary = this.libraries[0].id;
        }

        // The 'library-loaded' flag being set on the host element indicates that
        // this is the merged config and the rest of the UI should be set up
        // now. Otherwise we'll need to create the config and reload the app.
        const { hostElement } = this.appContext;
        if (hostElement.hasAttribute("library-loaded")) {
            this._restoreVisibility();

            // setTimeout is necessary here in order to make sure our custom
            // commands have initialized.
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            setTimeout(async () => {
                await this._displayUI(this.selectedLibrary);
            }, 100);
        } else {
            hostElement.style.display = "none";
            parent.location.hash = this.selectedLibrary;
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            setTimeout(() => this._loadLibrary(this.selectedLibrary), 100);
        }
    }

    protected override async _onDestroy(): Promise<void> {
        await super._onDestroy();
        parent.onhashchange = undefined;
    }

    protected override _getSerializableProperties(): PropertyDefs<LibraryViewerModelProperties> {
        const props = super._getSerializableProperties();
        return {
            ...props,
            libraries: {
                serializeModes: ["initial"],
            },
        };
    }

    @command("library-viewer.load-library")
    protected async _executeLoadLibrary(
        libraryConfig: LibraryConfig
    ): Promise<void> {
        const { id: libraryId, useHostPage } = libraryConfig;
        const { hostElement } = this.appContext;
        const viewerId = "library-viewer";

        // Gather the materials needed for the library to load.
        const [
            sampleAppConfig,
            sampleLayout,
            customLibrary,
            viewerAppConfig,
            viewerLayout,
        ] = await Promise.all([
            import(
                /* webpackExclude: /node_modules/ */ `../../../../../samples/${libraryId}/app/app.json`
            ),
            import(
                /* webpackExclude: /node_modules/ */ `../../../../../samples/${libraryId}/app/layout.xml`
            ),
            import(
                /* webpackExclude: /(node_modules|library-viewer)/ */ `../../../../../samples/${libraryId}/build/main.js`
            ),
            import(
                /* webpackExclude: /node_modules/ */ `../../../../../samples/${viewerId}/app/app.json`
            ),
            import(
                /* webpackExclude: /node_modules/ */ `../../../../../samples/${viewerId}/app/layout.xml`
            ),
        ]);

        if (useHostPage) {
            this.hostPage = (
                await import(
                    /* webpackExclude: /node_modules/ */ `!!file-loader!../../../../../samples/${libraryId}/app/parent.html`
                )
            )?.default as string;
            this.handleHostFrameLoaded = (iframe: HTMLIFrameElement) => {
                const embeddedHost =
                    iframe.contentDocument.getElementById("gcx-app");
                embeddedHost.classList.add("hide-nested-warning");
                this._loadViewer({
                    frame: iframe.contentWindow as Window & typeof globalThis,
                    appConfig: sampleAppConfig?.default as AppConfig,
                    layout: sampleLayout?.default as LayoutXml,
                    customLibrary: customLibrary?.default as Library,
                    hostElement: embeddedHost,
                });
            };
        } else {
            await this._loadMergedConfig({
                sampleLayout: sampleLayout?.default as LayoutXml,
                viewerLayout: viewerLayout?.default as LayoutXml,
                sampleAppConfig: sampleAppConfig?.default as AppConfig,
                viewerAppConfig: viewerAppConfig?.default as AppConfig,
                customLibrary: customLibrary?.default as Library,
                hostElement,
            });
        }
    }

    private async _loadMergedConfig({
        sampleLayout,
        viewerLayout,
        viewerAppConfig,
        sampleAppConfig,
        customLibrary,
        hostElement,
    }: {
        sampleLayout: LayoutXml;
        viewerLayout: LayoutXml;
        viewerAppConfig: AppConfig;
        sampleAppConfig: AppConfig;
        customLibrary: Library;
        hostElement: HTMLElement;
    }): Promise<void> {
        // Parse the currently loaded layout and the library sample layout into
        // JSON objects.
        const [libraryXml, baseXml] = await Promise.all([
            parseString(sampleLayout),
            parseString(viewerLayout),
        ]);
        // Merge their top level attributes to get all the namespaces.
        baseXml.layout.$ = { ...baseXml.layout.$, ...libraryXml.layout.$ };

        // Add the sample layout items as children of the library-viewer component.
        const mergeRoot =
            baseXml.layout.split[0].stack[0]["library:library-viewer"][0];
        this._getChildElementNames(
            libraryXml.layout as Record<string, unknown>
        ).forEach(
            (element) => (mergeRoot[element] = libraryXml.layout[element])
        );

        // Output the merged layout as a string.
        const xmlBuilder = new Builder();
        const layout = xmlBuilder.buildObject(baseXml);

        // Merge the 'items' collections of the two AppConfig objects, taking
        // care not to modify the originals.
        const appConfig = { ...viewerAppConfig } as AppConfig;
        const mergedItems = [...viewerAppConfig.items];
        appConfig.items = mergedItems;
        const libraryAppConfig = sampleAppConfig;
        libraryAppConfig.items.forEach((item) => {
            if (!mergedItems.some((appItem) => appItem.id === item.id)) {
                mergedItems.push(item);
            } else {
                const existingItem = mergedItems.find(
                    (appItem) => appItem.id === item.id
                );
                const mergedItem = { ...existingItem, ...item };
                mergedItems.splice(
                    mergedItems.indexOf(existingItem),
                    1,
                    mergedItem
                );
            }
        });

        // Cleanly shutdown the current application.
        await this.appContext.shutdown();

        // Bootstrap a new viewer application in the current iframe with the merged layout and config.
        this._loadViewer({
            frame: window,
            appConfig,
            layout,
            customLibrary,
            hostElement,
        });
    }

    /**
     * Handle programatically loading the viewer and injecting the app, layout
     * and custom library. This method of loading is included for demonstration
     * purposes only and is not recommended for use in production.
     */
    private _loadViewer({
        frame,
        appConfig,
        layout,
        customLibrary,
        hostElement,
    }: {
        frame: Window & typeof globalThis;
        appConfig: AppConfig;
        layout: LayoutXml;
        customLibrary: Library;
        hostElement: HTMLElement;
    }): void {
        (frame.require as any)(["require", "web"], (require, webViewer) => {
            require([
                "@vertigis/web-libraries!/common",
                "@vertigis/web-libraries!/web",
                "/main.js",
            ], (...libs) => {
                const options = {
                    appConfig,
                    debugMode: true,
                    hostElement,
                    layout,
                    libraries: [
                        ...libs.map((lib) => lib.default),
                        customLibrary,
                    ],
                    applicationParams: [
                        ["includeFunctionalTestHelpers", "true"],
                    ],
                };
                webViewer.bootstrap(options);
            });
        });
    }

    private async _displayUI(selectedLibrary: string): Promise<void> {
        const constructedUrl =
            // This import makes the library download available at the constructed url.
            (
                await import(
                    /* webpackExclude: /(node_modules|library-viewer)/ */
                    `!!file-loader?{"name": "static/js/[name].[contenthash:8].[ext]"}!../../../../../samples/${selectedLibrary}/build/main.js`
                )
            )?.default as string;

        // This happens in the production build for some reason.
        if (constructedUrl.startsWith(".static")) {
            this.libraryUrl = constructedUrl.replace(".", "../");
        } else {
            this.libraryUrl = constructedUrl;
        }

        if (!parent.onhashchange) {
            parent.onhashchange = () => this._handleHashChangeEvent();
        }

        await Promise.all([
            this.messages
                .command<SetLibraryArgs>("library-viewer.set-libraries")
                .execute({ libraries: this.libraries, selectedLibrary }),
            this.messages
                .command<string>("library-viewer.display-readme")
                .execute(selectedLibrary),
        ]);
    }

    private async _loadLibrary(selectedLibrary: string): Promise<void> {
        const { hostElement } = this.appContext;
        const library = this.libraries.find(
            (library) => library.id === selectedLibrary
        );
        if (library) {
            hostElement.setAttribute("library-loaded", selectedLibrary);
            await this.messages
                .command<LibraryConfig>("library-viewer.load-library")
                .execute(library);

            // If using a host page the application never restarts, so this
            // needs to be taken care of here.
            if (library.useHostPage) {
                this._restoreVisibility();
                await this._displayUI(selectedLibrary);
            }
        }
    }

    private _restoreVisibility(): void {
        this.appContext.hostElement.style.display = "block";

        // When running in netlify this lets us show a loading spinner, see
        // `viewer/build/index.html`
        const iframe = parent.document.getElementById(
            "vgs_web_library_viewer_iframe"
        );
        if (iframe) {
            iframe.style.display = "block";
        }
    }

    private async _handleHashChangeEvent(): Promise<void> {
        await this._loadLibrary(parent.location.hash.substring(1));
    }

    private _getChildElementNames(element: Record<string, unknown>): string[] {
        return Object.keys(element).filter((key) => key !== "$");
    }
}
