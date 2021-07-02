import { ReactElement, useContext } from "react";
import {
    LayoutElement,
    LayoutElementProperties,
} from "@vertigis/web/components";
import { UIContext } from "@vertigis/web/ui";
import Button from "@vertigis/web/ui/Button";
import Typography from "@vertigis/web/ui/Typography";
import TranslatableTextModel from "./TranslatableTextModel";

export default function TranslatableText(
    props: LayoutElementProperties<TranslatableTextModel>
): ReactElement {
    // The type of the `UIContext` functions will be fixed in 5.8 to be arrow functions.
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { translate } = useContext(UIContext);

    return (
        <LayoutElement {...props}>
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
