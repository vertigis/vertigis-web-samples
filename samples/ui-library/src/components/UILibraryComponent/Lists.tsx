import MenuItem from "@vertigis/web/ui/MenuItem";
import MenuList from "@vertigis/web/ui/MenuList";
import { ReactElement } from "react";

export default function Lists(): ReactElement {
    return (
        <>
            <MenuList aria-label="main mailbox folders">
                <MenuItem>Inbox</MenuItem>
                <MenuItem selected>Drafts (selected)</MenuItem>
                <MenuItem disabled>Trash (disabled)</MenuItem>
                <MenuItem>Spam</MenuItem>
            </MenuList>
        </>
    );
}
