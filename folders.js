const chokidar = require("chokidar");
const fs = require("fs");
const Renderer = require("./renderer");
const path = require('path');

var Folders = function (config) {
    this.config = config;

    this.watchers = {};
    for (let folder of this.config.get("folders").value()) {
        let watchPath = path.join(folder.path, "/**/*.md");
        let watcher = chokidar.watch(watchPath, { persistent: true });
        this.watchers[folder.name] = watcher

        callback = function (file) {
            this.updateFile(folder, file)
        }.bind(this);

        watcher.on('add', callback)
            .on('change', callback);

    }
}

Folders.prototype.updateFile = function (folderConfig, mdfile) {
    let parsedMdFile = path.parse(mdfile);
    let previewFile = path.join(parsedMdFile.dir, "." + parsedMdFile.name + ".htm");

    // Überprüfen, dass Preview-File älter ist als md-File
    if (fs.existsSync(previewFile)) {
        let mdStats = fs.statSync(mdfile);
        let previewStats = fs.statSync(previewFile);

        if (mdStats.mtime <= previewStats.mtime) {
            return;
        }
    }

    console.log(`${folderConfig.name}: ${mdfile} > ${previewFile}`);

    renderer = new Renderer(mdfile, previewFile);
    let result = renderer.render();
    if (result) {
        console.info(`Fehler: ${result}`);
        return;
    }
}

module.exports = Folders