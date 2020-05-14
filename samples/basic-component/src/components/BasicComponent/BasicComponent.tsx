import React from "react";
import {
    LayoutElement,
    LayoutElementProperties,
} from "@geocortex/web/components";
import { useWatchAndRerender } from "@geocortex/web/ui";
import Button from "@geocortex/web/ui/button";
import Typography from "@geocortex/web/ui/typography";
import BasicComponentModel from "./BasicComponentModel";
import "./BasicComponent.css";

const BasicComponent = (
    props: LayoutElementProperties<BasicComponentModel>
) => {
    const { model } = props;

    // Watch for changes to the hidden property on the model
    useWatchAndRerender(model, "hidden");

    return (
        <LayoutElement {...props} className="BasicComponent">
            <Typography variant="h2" gutterBottom>
                I'm a basic component
            </Typography>
            {/* Change the underlying model property value to trigger a re-render */}
            <Button onClick={() => (model.hidden = !model.hidden)}>
                {model.hidden ? "Show Me" : "Hide Me"}
            </Button>
            {!model.hidden && <Typography>BOO!</Typography>}
        </LayoutElement>
    );
};

export default BasicComponent;
