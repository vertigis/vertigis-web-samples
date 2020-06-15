import { UIContext } from "@vertigis/web/ui";
import Button from "@vertigis/web/ui/Button";
import React from "react";
import UILibraryComponentModel from "./UILibraryComponentModel";

export default function Buttons() {
    const { commands } = React.useContext(UIContext);

    const handleClick = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        commands.ui.alert.execute({
            message: "Button clicked!",
        });
    };

    return (
        <>
            <Button onClick={handleClick} emphasis="low" size="small">
                Low emphasis small
            </Button>
            <Button onClick={handleClick} emphasis="low">
                Low emphasis medium
            </Button>
            <Button onClick={handleClick} emphasis="low" size="large">
                Medium emphasis large
            </Button>
            <Button onClick={handleClick} emphasis="low" disabled>
                Low emphasis disabled
            </Button>
            <Button onClick={handleClick} size="small">
                Medium emphasis small
            </Button>
            <Button onClick={handleClick}>Medium emphasis medium</Button>
            <Button onClick={handleClick} size="large">
                Medium emphasis large
            </Button>
            <Button onClick={handleClick} emphasis="low" disabled>
                Medium emphasis disabled
            </Button>
            <Button onClick={handleClick} emphasis="high" size="small">
                High emphasis small
            </Button>
            <Button onClick={handleClick} emphasis="high">
                High emphasis medium
            </Button>
            <Button onClick={handleClick} emphasis="high" size="large">
                High emphasis large
            </Button>
            <Button onClick={handleClick} emphasis="high" disabled>
                High emphasis disabled
            </Button>
        </>
    );
}
