import Checkbox from "@geocortex/web/ui/checkbox";
import FormControl from "@geocortex/web/ui/form-control";
import FormControlLabel from "@geocortex/web/ui/form-control-label";
import FormHelperText from "@geocortex/web/ui/form-helper-text";
import FormLabel from "@geocortex/web/ui/form-label";
import Input from "@geocortex/web/ui/input";
import MenuItem from "@geocortex/web/ui/menu-item";
import Radio from "@geocortex/web/ui/radio";
import RadioGroup from "@geocortex/web/ui/radio-group";
import Select from "@geocortex/web/ui/select";
import Typography from "@geocortex/web/ui/typography";
import React from "react";

function CheckboxDemo() {
    const [state, setState] = React.useState({
        gilad: true,
        jason: false,
        antoine: false,
    });

    const { gilad, jason, antoine } = state;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    return (
        <>
            <FormControlLabel label="Checkbox" control={<Checkbox />} />
            <div>
                <FormControl {...{ component: "fieldset" }}>
                    <FormLabel {...{ component: "legend" }}>
                        Assign responsibility
                    </FormLabel>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={gilad}
                                onChange={handleChange}
                                name="gilad"
                            />
                        }
                        label="Gilad Gray"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={jason}
                                onChange={handleChange}
                                name="jason"
                            />
                        }
                        label="Jason Killian"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={antoine}
                                onChange={handleChange}
                                name="antoine"
                            />
                        }
                        label="Antoine Llorca"
                    />
                </FormControl>
            </div>
        </>
    );
}

function InputDemo() {
    const [value, setValue] = React.useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    return (
        <>
            <div>
                <FormControl>
                    <FormLabel htmlFor="input-controlled">
                        Controlled Input
                    </FormLabel>
                    <Input
                        value={value}
                        onChange={handleChange}
                        id="input-controlled"
                    />
                </FormControl>
            </div>
            <div>
                <FormControl>
                    <FormLabel htmlFor="input-uncontrolled">
                        Uncontrolled Input
                    </FormLabel>
                    <Input id="input-uncontrolled" />
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
        // TODO: Remove spread once prop types are fixed
        <FormControl {...{ component: "fieldset" }}>
            <FormLabel {...{ component: "legend" }}>Gender</FormLabel>
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
                <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                />
                <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                />
                <FormControlLabel
                    value="disabled"
                    disabled
                    control={<Radio />}
                    label="(Disabled option)"
                />
            </RadioGroup>
        </FormControl>
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

export default function FormControls() {
    return (
        <>
            <Typography gutterBottom variant="h2">
                Inputs
            </Typography>
            <InputDemo />
            <Typography gutterBottom variant="h2">
                Checkboxes
            </Typography>
            <CheckboxDemo />
            <Typography gutterBottom variant="h2">
                Radios
            </Typography>
            <RadioDemo />
            <Typography gutterBottom variant="h2">
                Selects
            </Typography>
            <SelectDemo />
        </>
    );
}
