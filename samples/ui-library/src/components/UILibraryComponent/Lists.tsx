import MenuItem from "@geocortex/web/ui/menu-item";
import MenuList from "@geocortex/web/ui/menu-list";
import React from "react";

export default function Lists() {
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
