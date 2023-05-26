import React, { ReactElement, useContext, useState } from "react";
import {
    LayoutElement,
    LayoutElementProperties,
} from "@vertigis/web/components";
import { UIContext } from "@vertigis/web/ui";
import List from "@vertigis/web/ui/List";
import ListItem from "@vertigis/web/ui/ListItem";
import ListItemIcon from "@vertigis/web/ui/ListItemIcon";
import FormControlLabel from "@vertigis/web/ui/FormControlLabel";
import Checkbox from "@vertigis/web/ui/Checkbox";
import Stack from "@vertigis/web/ui/Stack";
import Box from "@vertigis/web/ui/Box";
import Typography from "@vertigis/web/ui/Typography";
import TranslatableTextModel from "./IconListModel";

export default function IconList(
    props: LayoutElementProperties<TranslatableTextModel>
): ReactElement {
    const { model } = props;
    const { getIcon } = useContext(UIContext);
    const [showOnlyUnicons, setShowOnlyUnicons] = useState(true);
    const [currentIcon, setCurrentIcon] = useState("");
    const Icon = currentIcon && getIcon(currentIcon);

    return (
        <LayoutElement {...props}>
            <Stack direction="row" sx={{ minHeight: 0 }}>
                <Stack sx={{ overflowY: "scroll" }}>
                    <Typography variant="h3">Icon List:</Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showOnlyUnicons}
                                onChange={() =>
                                    setShowOnlyUnicons(!showOnlyUnicons)
                                }
                            />
                        }
                        label="Show Only Unicons?"
                    />
                    <Box>
                        <List>
                            {model?.iconNames
                                .filter((icon) =>
                                    showOnlyUnicons
                                        ? icon.startsWith("uil")
                                        : true
                                )
                                .map((icon) => {
                                    const Icon = getIcon(icon);
                                    return (
                                        <ListItem
                                            sx={{ cursor: "pointer" }}
                                            key={`icon-${icon}`}
                                            selected={icon === currentIcon}
                                            onClick={() => setCurrentIcon(icon)}
                                        >
                                            <ListItemIcon>
                                                <Icon />
                                            </ListItemIcon>
                                            {icon}
                                        </ListItem>
                                    );
                                })}
                        </List>
                    </Box>
                </Stack>
                <Box margin={2}>
                    {Icon && <Icon width="100" height="100" />}
                </Box>
            </Stack>
        </LayoutElement>
    );
}
