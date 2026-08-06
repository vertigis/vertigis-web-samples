import type { LayoutElementProperties } from "@vertigis/web/components";
import { LayoutElement } from "@vertigis/web/components";
import { UIContext } from "@vertigis/web/ui";
import Box from "@vertigis/web/ui/Box";
import Checkbox from "@vertigis/web/ui/Checkbox";
import DynamicIcon from "@vertigis/web/ui/DynamicIcon";
import FormControlLabel from "@vertigis/web/ui/FormControlLabel";
import List from "@vertigis/web/ui/List";
import ListItemButton from "@vertigis/web/ui/ListItemButton";
import ListItemIcon from "@vertigis/web/ui/ListItemIcon";
import Stack from "@vertigis/web/ui/Stack";
import Typography from "@vertigis/web/ui/Typography";
import { useContext, useState } from "react";
import type { ReactElement } from "react";

import type TranslatableTextModel from "./IconListModel";

export default function IconList(
    props: LayoutElementProperties<TranslatableTextModel>
): ReactElement {
    const { model } = props;
    const { getIcon } = useContext(UIContext);
    const [showOnlyUserIcons, setShowOnlyUserIcons] = useState(true);
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
                                checked={showOnlyUserIcons ?? true}
                                onChange={() =>
                                    setShowOnlyUserIcons(!showOnlyUserIcons)
                                }
                            />
                        }
                        label="Show Only Custom Icons?"
                    />
                    <Box>
                        <List>
                            {model?.iconNames
                                .filter((icon) =>
                                    showOnlyUserIcons
                                        ? icon.startsWith("custom-")
                                        : true
                                )
                                .map((icon) => (
                                    <ListItemButton
                                        sx={{ cursor: "pointer" }}
                                        key={`icon-${icon}`}
                                        onClick={() => setCurrentIcon(icon)}
                                        selected={icon === currentIcon}
                                    >
                                        <ListItemIcon>
                                            <DynamicIcon src={icon} />
                                        </ListItemIcon>
                                        {icon}
                                    </ListItemButton>
                                ))}
                        </List>
                    </Box>
                </Stack>
                <Box margin={2}>
                    {Icon && (
                        <Icon style={{ width: "100px", height: "100px" }} />
                    )}
                </Box>
            </Stack>
        </LayoutElement>
    );
}
