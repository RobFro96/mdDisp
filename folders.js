const Folder = require("./folder");


var Folders = function (config) {
    this.config = config;
    this.folders = {}

    for (let name in this.config.get("folders").value()) {
        let folderPath = this.config.get("folders").get(name).value();
        this.folders[name] = new Folder(name, folderPath, config);
    }
}

Folders.prototype.getNames = function () {
    return Object.keys(this.config.get("folders").value());
}

Folders.prototype.folderExists = function (folderName) {
    return folderName in this.config.get("folders").value();
}

Folders.prototype.getFolderPath = function (folderName) {
    return this.config.get("folders").get(folderName).value();
}

Folders.prototype.getPreviewFile = function (folder, file) {
    return this.folders[folder].getPreviewFilename(file);
}

module.exports = Folders