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

function WebViewer(props: WebViewerProps) {
    const { sample } = props;

    const styles = useStyles();

    if (!sample) {
        return null;
    }

    return (
        <iframe
            className={styles.root}
            src={`${process.env.PUBLIC_URL}/viewer.html`}
            title="Sample preview"
            onLoad={(event) => {
                const iframeWindow = event.currentTarget.contentWindow;
                (iframeWindow as any).loadSample({ locale, sample });
            }}
        />
    );
}

export default WebViewer;
