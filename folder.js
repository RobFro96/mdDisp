const chokidar = require("chokidar");
const fs = require("fs");
const deepcopy = require("deepcopy");
const default_options = require("./templates/default-options.json");
const path = require('path');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const Renderer = require("./renderer")

var Folder = function (name, folder, config, autoRefresher) {
    this.name = name;
    this.path = folder;
    this.config = config;
    this.autoRefresher = autoRefresher;

    let watchPath = path.join(this.path, "/**/*.md");
    this.watcher = chokidar.watch(watchPath, { persistent: true });

    this.watcher.on('add', this.updateFile.bind(this))
        .on('change', this.updateFile.bind(this));

    let configPath = path.join(this.path, ".mdconfig.json");
    this.folderConfig = low(new FileSync(configPath));
    this.folderConfig.defaults(require("./default-folder-config.json")).write();
}

Folder.prototype.updateFile = function (mdfile) {
    let previewFile = this.getPreviewFilename(mdfile);

    // Überprüfen, dass Preview-File älter ist als md-File
    if (fs.existsSync(previewFile)) {
        let mdStats = fs.statSync(mdfile);
        let previewStats = fs.statSync(previewFile);

        if (mdStats.mtime <= previewStats.mtime) {
            return;
        }
    }

    console.log(`${this.folderConfig.get("name").value()}: ${mdfile} changed.`);

    this.generatePreview(mdfile);

    this.autoRefresher.onUpdate(mdfile);
}

Folder.prototype.generatePreview = function (mdfile) {
    let previewFile = this.getPreviewFilename(mdfile);

    let defaultOptions = Object.assign(deepcopy(default_options), this.folderConfig.options || {});
    let renderer = new Renderer(mdfile, previewFile, defaultOptions);
    let result = renderer.render();
    if (result) {
        console.info(`Fehler: ${result}`);
        return;
    }
}

/**
 * Gibt den Dateinamen der preview-Datei aus der json-Datei zurück.
 * @param {string} mdfile 
 */
Folder.prototype.getPreviewFilename = function (mdfile) {
    let parser = path.parse(mdfile);
    let previewFilename = this.config.get("preview_json").value().replace("#name", parser.name);
    return path.join(parser.dir, previewFilename);
}

module.exports = Folder