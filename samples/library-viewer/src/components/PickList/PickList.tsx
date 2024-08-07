import {
    LayoutElement,
    type LayoutElementProperties,
} from "@vertigis/web/components";
import { useWatchAndRerender } from "@vertigis/web/ui";
import ListItemButton from "@vertigis/web/ui/ListItemButton";
import MenuList from "@vertigis/web/ui/MenuList";
import Paper from "@vertigis/web/ui/Paper";
import Typography from "@vertigis/web/ui/Typography";
import type { FC } from "react";
import { useCallback } from "react";

import type PickListModel from "./PickListModel";
import type { LibraryConfig } from "../LibraryViewer/LibraryViewerModel";

export interface PickListProps extends LayoutElementProperties<PickListModel> {}

const variantMapping = { h3: "h1", h6: "h2" };

const PickList: FC<PickListProps> = ({ model, title, ...layoutProps }) => {
    const { libraries, selectedLibrary } = model;
    useWatchAndRerender(model, "libraries");
    useWatchAndRerender(model, "selectedLibrary");

    const onClick = useCallback(
        (library: LibraryConfig) => {
            if (selectedLibrary !== library.id) {
                model.selectedLibrary = library.id;
                parent.location.hash = library.id;
            }
        },
        [model, selectedLibrary]
    );

    return (
        <LayoutElement {...layoutProps} stretch className="pick-list">
            <Paper>
                <Typography variant="h3" variantMapping={variantMapping}>
                    {title}
                </Typography>
                <MenuList>
                    {libraries?.map((library) => (
                        <ListItemButton
                            key={library.id}
                            selected={selectedLibrary.includes(library.id)}
                            onClick={() => onClick(library)}
                        >
                            <Typography
                                variant="h6"
                                variantMapping={variantMapping}
                                sx={{ lineHeight: 2 }}
                            >
                                {library.title}
                            </Typography>
                        </ListItemButton>
                    ))}
                </MenuList>
            </Paper>
        </LayoutElement>
    );
};

export default PickList;
