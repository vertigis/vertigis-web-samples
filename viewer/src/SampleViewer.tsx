import { makeStyles } from "@vertigis/react-ui/styles";
import Tab from "@vertigis/react-ui/Tab";
import Tabs from "@vertigis/react-ui/Tabs";
import classNames from "classnames";
import React from "react";
import Sample from "./Sample";
import WebViewer from "./WebViewer";
import ReadmeViewer from "./ReadmeViewer";

function a11yProps(index: any) {
    return {
        id: `sample-viewer-tab-${index}`,
        "aria-controls": `sample-viewer-tabpanel-${index}`,
    };
}

interface TabPanelProps {
    children: React.ReactNode;
    index: any;
    value: any;
}

const useTabPanelStyles = makeStyles((theme) => ({
    root: {
        borderLeft: `1px solid ${theme.palette.grey[400]}`,
        display: "flex",
        flexGrow: 1,
    },
    hidden: {
        display: "none",
    },
}));

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    const classes = useTabPanelStyles();

    const hidden = value !== index;

    return (
        <div
            role="tabpanel"
            id={`sample-viewer-tabpanel-${index}`}
            aria-labelledby={`sample-viewer-tab-${index}`}
            className={classNames(classes.root, { [classes.hidden]: hidden })}
            {...other}
        >
            {children}
        </div>
    );
}

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
});

interface SampleViewerProps {
    sample: Sample;
}

export default function SampleViewer({ sample }: SampleViewerProps) {
    const classes = useStyles();

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                aria-label="simple tabs example"
            >
                <Tab label="Preview" {...a11yProps(0)}></Tab>
                <Tab label="Description" {...a11yProps(1)}></Tab>
            </Tabs>
            <TabPanel value={value} index={0}>
                <WebViewer sample={sample} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ReadmeViewer sample={sample} />
            </TabPanel>
        </div>
    );
}
