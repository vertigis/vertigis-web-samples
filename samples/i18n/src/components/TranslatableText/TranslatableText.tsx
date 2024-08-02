import type { LayoutElementProperties } from "@vertigis/web/components";
import { LayoutElement } from "@vertigis/web/components";
import { UIContext } from "@vertigis/web/ui";
import Button from "@vertigis/web/ui/Button";
import Typography from "@vertigis/web/ui/Typography";
import { useContext } from "react";
import type { ReactElement } from "react";

import type TranslatableTextModel from "./TranslatableTextModel";

export default function TranslatableText(
    props: LayoutElementProperties<TranslatableTextModel>
): ReactElement {
    const { translate } = useContext(UIContext);

    return (
        <LayoutElement {...props}>
            <Typography variant="h3">Translate function:</Typography>
            <div>{translate("language-translatable-text-content")}</div>
            <Typography variant="h3">
                The provided VertiGIS Studio Web React UI library components
                will handle translation for you:
            </Typography>
            <Typography>language-translatable-text-content</Typography>
            <Button>language-translatable-text-content</Button>
        </LayoutElement>
    );
}
