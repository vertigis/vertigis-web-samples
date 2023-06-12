import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import { createSvgIcon, pascalToKebabCase } from "./utilities.js";

// This script generates a function that invokes registerIcon() for every icon
// exported by @iconscout/react-unicons

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, "../../..");
const outPath = path.resolve(currentDir, "../src/_support");

// Remove existing auto generated files.
if (fs.existsSync(outPath)) {
    fs.rmSync(outPath, { force: true, recursive: true });
}
fs.mkdirSync(outPath);

// Remove these examples and add your own folders to create your own custom icon pack.
const iconsDirs = [
    "samples/icons-pack/svg",
    "node_modules/@iconscout/react-unicons/icons",
];

let registerIcons = `/**
 * NOTE: THIS CODE IS AUTO-GENERATED. DO NOT MODIFY BY HAND.
 */
import type { LibraryRegistry } from "@vertigis/web/config";

export function registerIcons(registry: LibraryRegistry): void {`;

for (const iconsDir of iconsDirs) {
    const iconsFullDir = path.join(rootDir, iconsDir);
    const files = fs.readdirSync(iconsFullDir);

    for (const file of files) {
        const ext = path.extname(file);
        if (ext !== ".js" && ext !== ".svg") {
            continue;
        }

        const fullFilePath = path.join(iconsFullDir, file);
        const moduleName = file.replace(/.(js|svg)$/, "");
        const id = pascalToKebabCase(moduleName);

        if (ext === ".js") {
            // Add this icon to the list of registrations.
            registerIcons += `
            registry.registerIcon({
                id: "custom-${id}",
                getComponentType: async () => (
                    await import("${path.posix.join(
                        iconsDir.replace(/^node_modules\//, ""),
                        moduleName
                    )}")
                ).default,
            });`;
        } else {
            // Create a React component from the raw svg and add it to the list
            // of registrations.
            const newModule = createSvgIcon(file, fullFilePath, outPath);
            registerIcons += `
            registry.registerIcon({
                id: "custom-${id}",
                getComponentType: async () => (
                    await import("./${newModule}")
                ).default,
            });`;
        }
    }
}

registerIcons += `\n}`;
fs.writeFileSync(path.join(outPath, "registerIcons.ts"), registerIcons);
