import type { AppContext } from "@vertigis/web/AppContext";
import { command } from "@vertigis/web/messaging";
import type { ComponentModelProperties } from "@vertigis/web/models";
import { ComponentModelBase, serializable } from "@vertigis/web/models";
import { FrameworkServiceType, inject } from "@vertigis/web/services";

const urlRegex = /\[.+?\]\((.*?)\)/g;

@serializable
export default class ReadMeModel extends ComponentModelBase<ComponentModelProperties> {
    @inject(FrameworkServiceType.APP_CONTEXT)
    appContext: AppContext;

    readme: string;
    codePage: string;
    codePageTitle: string;
    codePages: Record<string, string> = {};

    @command("library-viewer.display-readme")
    protected async _executeDisplayReadMe(libraryId: string): Promise<void> {
        this.readme = (
            await import(
                /* webpackExclude: /node_modules/ */ `../../../../../samples/${libraryId}/README.md`
            )
        )?.default;

        const localUrls = [...this.readme.matchAll(urlRegex)]
            .map((match) => match[1])
            .filter((url) => !url.startsWith("http"));

        // Use webpack's raw file loader to import the text of any code files
        // mentioned in the README. Note that each file extension you want to be
        // viewable must have a separate import statement here.
        await Promise.all(
            localUrls.map(async (url) => {
                const [path, extension] = url.split(".");
                const fullPath = `${libraryId}/${path}`;
                if (extension === "ts") {
                    this.codePages[url] = (
                        await import(
                            /* webpackExclude: /(node_modules|build)/ */ `!!raw-loader!../../../../../samples/${fullPath}.ts`
                        )
                    )?.default as string;
                }
                if (extension === "tsx") {
                    this.codePages[url] = (
                        await import(
                            /* webpackExclude: /(node_modules|build)/ */ `!!raw-loader!../../../../../samples/${fullPath}.tsx`
                        )
                    )?.default as string;
                }
                if (extension === "json") {
                    this.codePages[url] = (
                        await import(
                            /* webpackExclude: /(node_modules|build)/ */ `!!raw-loader!../../../../../samples/${fullPath}.json`
                        )
                    )?.default as string;
                }
            })
        );

        // Intercept clicks on links to source files and display the code inline instead.
        this.appContext.hostElement.ownerDocument.onclick = (event) => {
            const url = (event.target as HTMLAnchorElement)?.href;
            if (!url?.includes("viewer/")) {
                return true;
            }
            const [, path] = url.split("viewer/");
            this.codePageTitle = path.split("/").pop();
            this.codePage = `${"```"}\n${this.codePages[path]}\n${"```"}`;
            return false;
        };
    }
}
