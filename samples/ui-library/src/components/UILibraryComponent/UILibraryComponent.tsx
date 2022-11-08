import { ReactElement, ReactNode, useContext, useState } from "react";
import {
    LayoutElement,
    LayoutElementProperties,
} from "@vertigis/web/components";
import Tab from "@vertigis/web/ui/Tab";
import Tabs from "@vertigis/web/ui/Tabs";
import Switch from "@vertigis/web/ui/Switch";
import { styled, UIContext, useWatchAndRerender } from "@vertigis/web/ui";

import UILibraryComponentModel from "./UILibraryComponentModel";
import Buttons from "./Buttons";
import FormControls from "./FormControls";
import Lists from "./Lists";
import TypographyDemo from "./Typography";
import Stack from "@vertigis/web/ui/Stack";
import FormControlLabel from "@vertigis/web/ui/FormControlLabel";

function tabA11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

interface TabPanelProps {
    children?: ReactNode;
    index: number;
    value: number;
}

// Using `styled()` is an alternative to importing .css files for styling your
// components. It's based on MUI's system
// (https://mui.com/system/getting-started/overview/), which is a CSS-in-JS
// solution that gives you access to aspects of the MUI theme that can't be used
// in CSS files, such as the spacing() function shown below. Using spacing,
// typography, etc. from the MUI system will help ensure that your custom UI
// will match up better withWeb's built-in components.
//
// Using `styled()` is appropriate when creating reusable components. For
// one-off styling, most Web UI components also have an `sx` prop
// (https://mui.com/system/getting-started/the-sx-prop/) which allows quick
// shortcuts for styling based on the theme. See UILibraryComponent below for
// examples.
const TabPanelRoot = styled("div")(({ theme }) => ({
    padding: theme.spacing(2),
    flexGrow: 1,
    overflow: "auto",
}));

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <TabPanelRoot
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </TabPanelRoot>
    );
}

export default function UILibraryComponent(
    props: LayoutElementProperties<UILibraryComponentModel>
): ReactElement {
    const [tabValue, setTabValue] = useState(0);
    const { commands, brandingService } = useContext(UIContext);
    useWatchAndRerender(brandingService, "activeTheme");

    return (
        <LayoutElement {...props} stretch>
            <Stack
                direction="column"
                alignItems="initial"
                sx={{ width: "100%", height: "100%" }}
            >
                <Stack direction="column" sx={{ p: 2 }}>
                    <FormControlLabel
                        label="Dark Mode"
                        control={
                            <Switch
                                value={
                                    brandingService.activeTheme.id === "dark"
                                }
                                onChange={(e, checked) => {
                                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                                    commands.ui.setTheme.execute(
                                        checked ? "dark" : "light"
                                    );
                                }}
                            />
                        }
                    />
                    <FormControlLabel
                        label="Compact Mode"
                        control={
                            <Switch
                                value={brandingService.density === "compact"}
                                onChange={(e, checked) => {
                                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                                    commands.ui.setDensity.execute(
                                        checked ? "compact" : "standard"
                                    );
                                }}
                            />
                        }
                    />
                </Stack>
                <Tabs
                    value={tabValue}
                    onChange={(event, newValue) => {
                        setTabValue(newValue as React.SetStateAction<number>);
                    }}
                    aria-label="simple tabs example"
                    indicatorColor="primary"
                >
                    <Tab label="Buttons" {...tabA11yProps(0)} />
                    <Tab label="Form Controls" {...tabA11yProps(1)} />
                    <Tab label="Lists" {...tabA11yProps(2)} />
                    <Tab label="Typography" {...tabA11yProps(3)} />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    <Buttons />
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
            </Stack>
        </LayoutElement>
    );
}
