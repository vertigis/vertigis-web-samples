import {
    LayoutElement,
    type LayoutElementProperties,
} from "@vertigis/web/components";
import LayoutElementContainer from "@vertigis/web/components/LayoutElementContainer";
import { useWatchAndRerender } from "@vertigis/web/ui";
import Link from "@vertigis/web/ui/Link";
import Stack from "@vertigis/web/ui/Stack";
import type { FC } from "react";

import type LibraryViewerModel from "./LibraryViewerModel";
import "./LibraryViewer.css";

export interface LibraryViewerProps
    extends LayoutElementProperties<LibraryViewerModel> {}

const LibraryViewer: FC<LibraryViewerProps> = ({
    model,
    children,
    ...layoutProps
}) => {
    const { selectedLibrary, codeSandboxUrl, hostPage } = model;
    useWatchAndRerender(model, "libraryUrl");
    useWatchAndRerender(model, "hostPage");

    return (
        <LayoutElement {...layoutProps} stretch className="library-viewer">
            <Stack
                sx={{
                    marginTop: 4,
                    marginLeft: 4,
                    marginBottom: 0,
                    marginRight: 4,
                }}
            >
                {hostPage ? (
                    <iframe
                        height="100%"
                        name="host-frame"
                        src={hostPage}
                        onLoad={(event) => {
                            const nestedFrame =
                                event.currentTarget.contentDocument.getElementById(
                                    "embedded-viewer"
                                ) as HTMLIFrameElement;
                            model.handleHostFrameLoaded?.(nestedFrame);
                        }}
                    ></iframe>
                ) : (
                    <LayoutElementContainer
                        sx={{ border: "1px solid lightgrey" }}
                    >
                        {children}
                    </LayoutElementContainer>
                )}
                <Link
                    href={`https://github.com/vertigis/vertigis-web-samples/tree/main/samples/${selectedLibrary}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View the source code on GitHub
                </Link>
                <Link
                    href={codeSandboxUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Edit this sample in CodeSandbox
                </Link>
            </Stack>
        </LayoutElement>
    );
};

export default LibraryViewer;
