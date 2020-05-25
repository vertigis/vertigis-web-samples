import Button from "@geocortex/web/ui/button";
import React from "react";

export default function Buttons() {
    return (
        <>
            <Button emphasis="low" size="small">
                Low emphasis small
            </Button>
            <Button emphasis="low">Low emphasis medium</Button>
            <Button emphasis="low" size="large">
                Medium emphasis large
            </Button>
            <Button emphasis="low" disabled>
                Low emphasis disabled
            </Button>
            <Button size="small">Medium emphasis small</Button>
            <Button>Medium emphasis medium</Button>
            <Button size="large">Medium emphasis large</Button>
            <Button emphasis="low" disabled>
                Medium emphasis disabled
            </Button>
            <Button emphasis="high" size="small">
                High emphasis small
            </Button>
            <Button emphasis="high">High emphasis medium</Button>
            <Button emphasis="high" size="large">
                High emphasis large
            </Button>
            <Button emphasis="high" disabled>
                High emphasis disabled
            </Button>
        </>
    );
}
