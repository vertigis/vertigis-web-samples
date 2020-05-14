import React, { useContext } from "react";
import { LayoutElement } from "@geocortex/web/components";
import { UIContext } from "@geocortex/web/ui";
import Button from "@geocortex/web/ui/button";
import Typography from "@geocortex/web/ui/typography";

export default function TranslatableText(props) {
    const { translate } = useContext(UIContext);

    return (
        <LayoutElement {...props} style={{ backgroundColor: "white" }}>
            <Typography variant="h3">Translate function:</Typography>
            <div>{translate("language-translatable-text-content")}</div>
            <Typography variant="h3">
                The provided Geocortex Web React UI library components will
                handle translation for you:
            </Typography>
            <Typography>language-translatable-text-content</Typography>
            <Button>language-translatable-text-content</Button>
        </LayoutElement>
    );
}
