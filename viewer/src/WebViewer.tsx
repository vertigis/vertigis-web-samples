import { makeStyles } from "@material-ui/core/styles";
import React from "react";

export interface Sample {
    app: any;
    layout: any;
    library: any;
}

interface WebViewerProps {
    sample: Sample | undefined;
}

const useStyles = makeStyles((theme) => ({
    root: {
        border: 0,
        height: "100%",
        width: "100%",
    },
}));

const urlParams = new URLSearchParams(window.location.search);
const locale = urlParams.get("locale");

function loadSample(sample: Sample, iframe: HTMLIFrameElement) {
    const iframeDocument = iframe.contentDocument;

    if (!iframeDocument) {
        throw new Error("Web frame failed to load");
    }

    function bootstrap() {
        const iframeWindow = iframe.contentWindow as
            | (Window & { require: any })
            | null;

        if (!iframeWindow || !iframeWindow.require) {
            throw new Error("Web frame failed to load");
        }

        iframeWindow.require(["require", "gwv"], function (require, webViewer) {
            function getAbsoluteUrl(relativePath) {
                const a = document.createElement("a");
                a.href = relativePath;
                return a.href;
            }
            // Load common web libs as well as our custom bundle
            require([
                "@geocortex/web-libraries!/common",
                "@geocortex/web-libraries!/web",
                sample.library,
            ], (...libs) => {
                const options = {
                    appConfig: sample.app,
                    layout: getAbsoluteUrl(sample.layout),
                    libraries: libs.map((lib) => lib.default),
                    locale,
                };
                webViewer.bootstrap(options);
            });
        });
    }

    if (iframeDocument.readyState === "complete") {
        bootstrap();
    } else {
        iframeDocument.addEventListener("DOMContentLoaded", bootstrap);
    }
}

/**
 * Loading the viewer programmatically like this is for
 * convenience, and is NOT recommended in production.
 */
function WebViewer(props: WebViewerProps) {
    const { sample } = props;

    const styles = useStyles();

    if (!sample) {
        return null;
    }

    return (
        <iframe
            className={styles.root}
            data-cy="viewer-frame"
            src={`${process.env.PUBLIC_URL}/viewer/index.html#no-bootstrap`}
            title="Sample preview"
            onLoad={(event) => {
                const iframe = event.currentTarget;
                loadSample(sample, iframe);
            }}
        />
    );
}

export default WebViewer;
