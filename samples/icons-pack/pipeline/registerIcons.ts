import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// This script generates a function that invokes registerIcon() for every icon
// exported by @iconscout/react-unicons

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, "../../..");
const iconsDir = path.join(
    rootDir,
    "node_modules/@iconscout/react-unicons/icons"
);

let registerIcons = `/**
 * NOTE: THIS CODE IS AUTO-GENERATED. DO NOT MODIFY BY HAND.
 */
import type { LibraryRegistry } from "@vertigis/web/config";
export function registerIcons(registry: LibraryRegistry): void {`;

const files = fs.readdirSync(iconsDir);

for (const file of files) {
    if (path.extname(file) !== ".js") {
        continue;
    }

    const moduleName = file.replace(/.js$/, "");

    // Add this icon to the list of registrations.
    registerIcons += `
    registry.registerIcon({
        id: "${moduleName}",
        getComponentType: async () => (
            await import(/* webpackChunkName: "icons/${moduleName}" */ "@iconscout/react-unicons/icons/${moduleName}")
        ).default,
    });`;
}

registerIcons += `\n}`;
const registerPath = path.resolve(currentDir, "../src/_support");
if (!fs.existsSync(registerPath)) {
    fs.mkdirSync(registerPath);
}
fs.writeFileSync(path.join(registerPath, "registerIcons.ts"), registerIcons);
