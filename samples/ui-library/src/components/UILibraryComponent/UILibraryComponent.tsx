import React from "react";
import {
    LayoutElement,
    LayoutElementProperties,
} from "@geocortex/web/components";
import Tab from "@geocortex/web/ui/tab";
import Tabs from "@geocortex/web/ui/tabs";
import UILibraryComponentModel from "./UILibraryComponentModel";
import Buttons from "./Buttons";
import FormControls from "./FormControls";
import Lists from "./Lists";
import TypographyDemo from "./Typography";
import "./UILibraryComponent.css";

function tabA11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function UILibraryComponent(
    props: LayoutElementProperties<UILibraryComponentModel>
) {
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (
        event: React.ChangeEvent<{}>,
        newValue: number
    ) => {
        setTabValue(newValue);
    };

    return (
        <LayoutElement {...props} stretch className="UILibraryComponent">
            <div>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="simple tabs example"
                    indicatorColor="primary"
                >
                    <Tab label="Buttons" {...tabA11yProps(0)} />
                    <Tab label="Form Controls" {...tabA11yProps(1)} />
                    <Tab label="Lists" {...tabA11yProps(2)} />
                    <Tab label="Typography" {...tabA11yProps(3)} />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    <Buttons model={props.model} />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <FormControls />
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <Lists />
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                    <TypographyDemo />
                </TabPanel>
            </div>
        </LayoutElement>
    );
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            className="UILibraryComponent-TabPanel"
            {...other}
        >
            {value === index && children}
        </div>
    );
}
