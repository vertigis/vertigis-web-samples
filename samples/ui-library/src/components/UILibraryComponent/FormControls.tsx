import Checkbox from "@vertigis/web/ui/Checkbox";
import FormControl from "@vertigis/web/ui/FormControl";
import FormControlLabel from "@vertigis/web/ui/FormControlLabel";
import FormHelperText from "@vertigis/web/ui/FormHelperText";
import FormLabel from "@vertigis/web/ui/FormLabel";
import Input from "@vertigis/web/ui/Input";
import MenuItem from "@vertigis/web/ui/MenuItem";
import Radio from "@vertigis/web/ui/Radio";
import RadioGroup from "@vertigis/web/ui/RadioGroup";
import Select from "@vertigis/web/ui/Select";
import Typography from "@vertigis/web/ui/Typography";
import { ChangeEvent, ReactElement, useState } from "react";

function CheckboxDemo() {
    const [state, setState] = useState({
        gilad: true,
        jason: false,
        antoine: false,
    });

    const { gilad, jason, antoine } = state;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
    const [value, setValue] = useState("");

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
    const [value, setValue] = useState("female");

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
    const [age, setAge] = useState("");

    const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
        setAge(event.target.value as string);
    };

    return (
        <>
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
                        renderValue={(value) => `⚠️  - ${value as string}`}
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
        </>
    );
}

export default function FormControls(): ReactElement {
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
