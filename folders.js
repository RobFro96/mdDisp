/**
 * mdDisp - Markdown Parser and Viewer
 * @author Robert Fromm
 * @data 14.08.2020
 * 
 * Server Side Javascript:
 * Managing and accessing all folders of the current configuration.
 */
const Folder = require("./folder");

/**
 * Constructor. Creating all folders and storing them into folders dictionary.
 * 
 * @param {lowdb} config global configuration as lowdb object
 * @param {AutoRefresher} autoRefresher AutoRefresher
 */
var Folders = function (config, autoRefresher) {
    this.config = config;
    this.autoRefresher = autoRefresher;
    this.folders = {}

    for (let name in this.config.get("folders").value()) {
        let folderPath = this.config.get("folders").get(name).value();
        this.folders[name] = new Folder(name, folderPath, config, autoRefresher);
    }
}

/**
 * Returns list of names of folders.
 */
Folders.prototype.getNames = function () {
    return Object.keys(this.config.get("folders").value());
}

/**
 * Checks if folder names exists.
 * 
 * @param {string} folderName name of folder
 */
Folders.prototype.folderExists = function (folderName) {
    return folderName in this.config.get("folders").value();
}

/**
 * Get the path of the specified folder.
 * @param {string} folderName name of folder
 */
Folders.prototype.getFolderPath = function (folderName) {
    return this.config.get("folders").get(folderName).value();
}

/**
 * Return name of preview file from folder and path of markdown file.
 * 
 * @param {string} folder name of folder
 * @param {string} file markdownfile
 */
Folders.prototype.getPreviewFile = function (folder, file) {
    return this.folders[folder].getPreviewFilename(file);
}

/**
 * Close all folder's watchers.
 */
Folders.prototype.closeAll = function () {
    for (let name in this.folders) {
        let folder = this.folders[name];
        folder.closeWatchers();
    }
}

module.exports = Folders