import React from "react";
import {
    LayoutElement,
    LayoutElementProperties,
} from "@geocortex/web/components";
import Button from "@geocortex/web/ui/button";
import Checkbox from "@geocortex/web/ui/checkbox";
import FormControl from "@geocortex/web/ui/form-control";
import FormHelperText from "@geocortex/web/ui/form-helper-text";
import FormLabel from "@geocortex/web/ui/form-label";
import FormControlLabel from "@geocortex/web/ui/form-control-label";
import Input from "@geocortex/web/ui/input";
import ListItem from "@geocortex/web/ui/list-item";
import ListItemText from "@geocortex/web/ui/list-item-text";
import MenuItem from "@geocortex/web/ui/menu-item";
import MenuList from "@geocortex/web/ui/menu-list";
import Radio from "@geocortex/web/ui/radio";
import RadioGroup from "@geocortex/web/ui/radio-group";
import Select from "@geocortex/web/ui/select";
import Tab from "@geocortex/web/ui/tab";
import Tabs from "@geocortex/web/ui/tabs";
import Typography from "@geocortex/web/ui/typography";
import UILibraryComponentModel from "./UILibraryComponentModel";
import "./UILibraryComponent.css";

function InputDemo() {
    const [value, setValue] = React.useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    return (
        <>
            <div>
                <FormControl>
                    <FormLabel>Controlled Input</FormLabel>
                    <Input value={value} onChange={handleChange} />
                </FormControl>
            </div>
            <div>
                <FormControl>
                    <FormLabel>Uncontrolled Input</FormLabel>
                    <Input />
                </FormControl>
            </div>
        </>
    );
}

function RadioDemo() {
    const [value, setValue] = React.useState("female");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    return (
        <RadioGroup
            aria-label="gender"
            name="gender1"
            value={value}
            onChange={handleChange}
        >
            <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
            />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
            <FormControlLabel
                value="disabled"
                disabled
                control={<Radio />}
                label="(Disabled option)"
            />
        </RadioGroup>
    );
}

function SelectDemo() {
    const [age, setAge] = React.useState("");

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setAge(event.target.value as string);
    };

    return (
        <div>
            <div>
                <FormControl>
                    <FormLabel id="demo-simple-select-label">Age</FormLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={age}
                        onChange={handleChange}
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div>
                <FormControl>
                    <FormLabel id="demo-simple-select-helper-label">
                        Age
                    </FormLabel>
                    <FormHelperText>Some important helper text</FormHelperText>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={age}
                        onChange={handleChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>TenFormLabel</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div>
                <FormControl>
                    <FormHelperText>Without label</FormHelperText>
                    <Select
                        value={age}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div>
                <FormControl>
                    <FormLabel id="demo-simple-select-placeholder-label-label">
                        Age
                    </FormLabel>
                    <FormHelperText>Label + placeholder</FormHelperText>
                    <Select
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        value={age}
                        onChange={handleChange}
                        displayEmpty
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div>
                <FormControl disabled>
                    <FormLabel id="demo-simple-select-disabled-label">
                        Name
                    </FormLabel>
                    <FormHelperText>Disabled</FormHelperText>
                    <Select
                        labelId="demo-simple-select-disabled-label"
                        id="demo-simple-select-disabled"
                        value={age}
                        onChange={handleChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div>
                <FormControl error>
                    <FormLabel id="demo-simple-select-error-label">
                        Name
                    </FormLabel>
                    <FormHelperText>Error</FormHelperText>
                    <Select
                        labelId="demo-simple-select-error-label"
                        id="demo-simple-select-error"
                        value={age}
                        onChange={handleChange}
                        renderValue={(value) => `⚠️  - ${value}`}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div>
                <FormControl>
                    <FormLabel id="demo-simple-select-readonly-label">
                        Name
                    </FormLabel>
                    <FormHelperText>Read only</FormHelperText>
                    <Select
                        labelId="demo-simple-select-readonly-label"
                        id="demo-simple-select-readonly"
                        value={age}
                        onChange={handleChange}
                        inputProps={{ readOnly: true }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div>
                <FormControl>
                    <FormLabel id="demo-simple-select-autowidth-label">
                        Age
                    </FormLabel>
                    <FormHelperText>Auto width</FormHelperText>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={age}
                        onChange={handleChange}
                        autoWidth
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div>
                <FormControl>
                    <FormHelperText>Placeholder</FormHelperText>
                    <Select
                        value={age}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                    >
                        <MenuItem value="" disabled>
                            Placeholder
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div>
                <FormControl required>
                    <FormLabel id="demo-simple-select-required-label">
                        Age
                    </FormLabel>
                    <FormHelperText>Required</FormHelperText>
                    <Select
                        labelId="demo-simple-select-required-label"
                        id="demo-simple-select-required"
                        value={age}
                        onChange={handleChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div>
    );
}

function ListDemo() {
    return (
        <>
            <MenuList aria-label="main mailbox folders">
                <ListItem button>
                    <ListItemText primary="Inbox" />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="Drafts" />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="Trash" />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="Spam" />
                </ListItem>
            </MenuList>
        </>
    );
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
                    <Tab label="Form Inputs" {...tabA11yProps(1)} />
                    <Tab label="Lists" {...tabA11yProps(2)} />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    <Button>Button</Button>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <FormControlLabel label="Checkbox" control={<Checkbox />} />
                    <InputDemo />
                    <RadioDemo />
                    <SelectDemo />
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <ListDemo />
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

function tabA11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}
