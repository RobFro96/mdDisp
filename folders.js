const chokidar = require("chokidar");
const fs = require("fs");
const Renderer = require("./renderer");
const path = require('path');
const deepcopy = require("deepcopy");
const default_options = require("./templates/default-options.json");

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
    let previewFile = this.getPreviewFile(folderConfig.name, mdfile);

    // Überprüfen, dass Preview-File älter ist als md-File
    if (fs.existsSync(previewFile)) {
        let mdStats = fs.statSync(mdfile);
        let previewStats = fs.statSync(previewFile);

        if (mdStats.mtime <= previewStats.mtime) {
            return;
        }
    }

    console.log(`${folderConfig.name}: ${mdfile} > ${previewFile}`);

    let defaultOptions = Object.assign(deepcopy(default_options), folderConfig.options || {});
    let renderer = new Renderer(mdfile, previewFile, defaultOptions);
    let result = renderer.render();
    if (result) {
        console.info(`Fehler: ${result}`);
        return;
    }
}

Folders.prototype.getFolderObj = function (folder) {
    return this.config.get("folders").find(folderObj => folderObj.name === folder);
}

Folders.prototype.hasPermission = function (user, folder) {
    folderObj = this.getFolderObj(folder);
    if (!folderObj) return false;

    return folderObj.get("users").includes(user);
}

Folders.prototype.getUserFolders = function (user) {
    let folders = [];

    for (let folder of this.config.get("folders").value()) {
        if (this.hasPermission(user, folder.name)) {
            folders.push(folder.name);
        }
    }

    return folders;
}

Folders.prototype.getPreviewFile = function (folder, mdFile) {
    let folderObj = this.getFolderObj(folder).value();
    if (!folderObj) return null;

    let parser = path.parse(mdFile);
    let previewFilename = (folderObj["export_name"] || ".#name.htm").replace("#name", parser.name);
    return path.join(parser.dir, previewFilename);
}

module.exports = Folders