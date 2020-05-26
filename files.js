const path = require('path');
const fs = require('fs');
const url = require("url")

let Files = function (config, folders) {
    this.config = config;
    this.folders = folders;


};

Files.prototype.routeRoot = function (req, res) {
    let data = {};
    data.user = req.user.name;
    data.location = "Overview";

    let structure = []
    for (folder of this.folders.getUserFolders(req.user.id)) {
        structure.push({
            icon: this.config.get("extensions.folder.icon").value(),
            name: folder,
            size: " ",
            lastModified: " ",
            link: "/files/" + folder,
            type: "link"
        });
    }
    data.structure = structure.sort((a, b) => a.name.localeCompare(b.name));

    res.render('explorer.ejs', data);
}

Files.prototype.routeFiles = function (req, res, next) {
    let data = {};
    data.user = req.user.name;

    let folder = req.params.folder;
    let subPath = req.params.path || "";

    data.location = folder + "/";
    if (subPath) data.location += subPath + "/";

    let folderObj = this.folders.getFolderObj(folder).value();

    if (!folderObj) {
        return next();
    }

    if (!req.user.name in folderObj.users) {
        return next();
    }

    let currentPath = path.join(folderObj.path, subPath);
    fs.readdir(currentPath, function (err, items) {
        if (err) {
            return next;
        }

        let structure = [];

        for (item of items) {
            let extension = path.parse(item).ext.substring(1);
            let file = path.join(currentPath, item);
            let stats = fs.lstatSync(file);

            if (stats.isDirectory()) {
                structure.push({
                    icon: this.config.get("extensions.folder.icon").value(),
                    name: item,
                    size: " ",
                    lastModified: " ",
                    link: "/" + path.join("files", folder, subPath, item).replace(/\\/g, "/"),
                    type: "link",
                    sortName: "a" + item
                });
            } else if (extension in this.config.get("extensions").value()) {
                let extensionObj = this.config.get("extensions." + extension).value();
                structure.push({
                    icon: extensionObj.icon,
                    name: item,
                    size: Math.ceil(stats.size / 1024.) + " KB",
                    lastModified: this.formatTime(stats.ctime),
                    link: "/" + path.join("file", folder, subPath, item).replace(/\\/g, "/"),
                    type: extensionObj.type,
                    sortName: "b" + item
                });
            }
        }

        data.structure = structure.sort((a, b) => a.sortName.localeCompare(b.sortName, undefined, { numeric: true }));
        res.render('explorer.ejs', data);
    }.bind(this));
}

Files.prototype.routeFile = function (req, res, next) {
    let folder = req.params.folder;
    let subPath = req.params.path || "";
    let folderObj = this.folders.getFolderObj(folder).value();

    if (!folderObj) {
        return next();
    }

    if (!req.user.name in folderObj.users) {
        return next();
    }

    let file = path.join(folderObj.path, subPath);
    let extension = path.parse(file).ext

    // Normale Datei
    if (extension != ".md") {
        return res.sendFile(file, { dotfiles: 'allow' }, function (err) {
            if (err) {
                return next();
            }
        });
    }

    // Markdown
    let previewFile = this.folders.getPreviewFile(folder, file);

    fs.readFile(previewFile, function (err, previewHtml) {
        if (err) {
            return next();
        }

        let data = {};
        data.user = req.user.name;
        data.location = folder + "/" + subPath;
        data.content = previewHtml;

        res.render("preview.ejs", data);
    }.bind(this));
}

Files.prototype.formatTime = function (time) {
    if (new Date().toLocaleDateString() == time.toLocaleDateString) {
        return time.toLocaleTimeString();
    } else {
        return time.getDate() + "." + (time.getMonth() + 1) + "." + time.getFullYear();
    }
}

module.exports = Files