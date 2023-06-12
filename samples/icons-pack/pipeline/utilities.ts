import * as fs from "fs";
import * as path from "path";
import svgr from "@svgr/core";

export const createSvgIcon = (
    file: string,
    filePath: string,
    outPath: string
) => {
    const componentName = snakeToPascal(file);
    const svg = svgr.transform.sync(fs.readFileSync(filePath, "utf8"), {
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        template: ({ jsx }, { tpl }) => {
            // Strip root <svg> element. If there are multiple children,
            // wrap them with a <g> element (this is a Babel AST node
            // object).
            const processedJsx =
                jsx.children.length === 1
                    ? jsx.children[0]
                    : {
                          type: "JSXElement",
                          openingElement: {
                              type: "JSXOpeningElement",
                              name: { type: "JSXIdentifier", name: "g" },
                              attributes: [],
                              selfClosing: false,
                          },
                          closingElement: {
                              type: "JSXClosingElement",
                              name: { type: "JSXIdentifier", name: "g" },
                          },
                          children: jsx.children,
                          selfClosing: null,
                      };
            return tpl`
                import createSvgIcon from "@vertigis/web/ui/icons/utils/createSvgIcon";
                export default createSvgIcon(${processedJsx}, "${componentName}");
              `;
        },
    });

    fs.writeFileSync(path.join(outPath, `${componentName}.tsx`), svg);
    return componentName;
};

export function pascalToKebabCase(str: string): string {
    return str?.replace(
        /[A-Z0-9]/g,
        (match, i) => `${i > 0 ? "-" : ""}${match.toLowerCase()}`
    );
}

const snakeToPascal = (string) => {
    return string
        .replace(".svg", "")
        .split(/-|_/)
        .map((str) => {
            return upperFirst(str.split("/").map(upperFirst).join("/"));
        })
        .join("");
};

const upperFirst = (string) => {
    return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
};
