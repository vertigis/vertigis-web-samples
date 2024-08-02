const { exec } = require("child_process");

const libraries = [
    "arcgis-widget",
    "basic-component",
    "basic-service",
    "commands-and-operations",
    "embedded-map",
    "i18n",
    "icons-pack",
    "iframe",
    "tap-into-web-event",
    "third-party-lib",
    "ui-library",
];

exec("shx cp -r ./samples/library-viewer/{app,build}/* ./viewer/build");

libraries.forEach((library) => {
    exec(`shx mkdir -p ./viewer/build/${library}`);
    exec(
        `shx cp -r ./samples/${library}/{app,build,README.md} ./viewer/build/${library}`
    );
});
