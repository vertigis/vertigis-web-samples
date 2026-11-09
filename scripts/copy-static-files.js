const { execSync } = require("child_process");
const viewerAppConfig = require("../samples/library-viewer/app/app.json");

// Use the same list of libraries as the library viewer.
const samples = viewerAppConfig.items
    .filter((item) => item.$type === "library-viewer-model")
    .flatMap((item) => item.libraries.map((library) => library.id));

// Run each command in sequence, and stop the build if a command fails.
const run = (command) => execSync(command, { stdio: "inherit" });

run("shx cp -r ./samples/library-viewer/{app,build}/* ./viewer/build");

for (const sample of samples) {
    run(`shx mkdir -p ./viewer/build/${sample}`);
    run(`shx cp -r ./samples/${sample}/{app,build,README.md} ./viewer/build/${sample}`);
}
