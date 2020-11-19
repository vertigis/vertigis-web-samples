const concurrently = require("concurrently");
const fs = require("fs");
const os = require("os");
const path = require("path");

const samplesRootDir = path.join(__dirname, "samples");

const sampleDirs = fs
    .readdirSync(samplesRootDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== "node_modules")
    .map((dirent) => path.join(samplesRootDir, dirent.name));

(async () => {
    try {
        const commands = sampleDirs.map((sampleDir) => ({
            command: `cd ${sampleDir} && yarn build`,
            name: path.basename(sampleDir),
        }));
        await concurrently(commands, { maxProcesses: os.cpus().length / 2 });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
