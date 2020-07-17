const express = require('express');
const path = require('path');
const fs = require('fs');

var Display = function (config, folders) {
    this.config = config;
    this.folders = folders;

    this.app = express();
    this.app.set('view-engine', 'ejs');
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.static('public'));

    this.app.get('/', this.routeRoot.bind(this));
    this.app.get('/files/:folder', this.routeFiles.bind(this));
    this.app.get('/files/:folder/:path(*)', this.routeFiles.bind(this));
    this.app.get('/file/:folder/:path(*)', this.routeFile.bind(this));

    // Handle 404
    this.app.use(function (req, res) {
        res.status(404).send('404: Page not Found @RF');
    });

    this.app.listen(this.config.get("web_port").value());
    console.log(`Listining on port ${this.config.get("web_port").value()}.`)
}

Display.prototype.routeRoot = function (req, res) {
    let data = {};
    data.location = "Overview";

    let structure = []
    for (folderName of this.folders.getNames()) {
        structure.push({
            icon: this.config.get("filebrowser_extensions.folder.icon").value(),
            name: folderName,
            size: " ",
            lastModified: " ",
            link: "/files/" + folderName,
            type: "link"
        });
    }
    data.structure = structure.sort((a, b) => a.name.localeCompare(b.name));

    res.render('explorer.ejs', data);
}

Display.prototype.routeFiles = function (req, res, next) {
    let data = {};

    let folder = req.params.folder;
    let subPath = req.params.path || "";

    if (!this.folders.folderExists(folder)) {
        return next();
    }

    data.location = folder + "/";
    if (subPath) data.location += subPath + "/";

    let currentPath = path.join(this.folders.getFolderPath(folder), subPath);

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
                    icon: this.config.get("filebrowser_extensions.folder.icon").value(),
                    name: item,
                    size: " ",
                    lastModified: " ",
                    link: "/" + path.join("files", folder, subPath, item).replace(/\\/g, "/"),
                    type: "link",
                    sortName: "a" + item
                });
            } else if (extension in this.config.get("filebrowser_extensions").value()) {
                let extensionObj = this.config.get("filebrowser_extensions." + extension).value();
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

Display.prototype.routeFile = function (req, res, next) {
    let folder = req.params.folder;
    let subPath = req.params.path || "";

    if (!this.folders.folderExists(folder)) {
        return next();
    }


    let file = path.join(this.folders.getFolderPath(folder), subPath);
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

    fs.readFile(previewFile, function (err, content) {
        if (err) {
            return next();
        }

        let json;
        try {
            json = JSON.parse(content);
        } catch {
            return next();
        }

        let data = {};
        data.location = folder + "/" + subPath;
        data.content = json.html;

        res.render("preview.ejs", data);
    }.bind(this));
}

Display.prototype.formatTime = function (time) {
    if (new Date().toLocaleDateString() == time.toLocaleDateString) {
        return time.toLocaleTimeString();
    } else {
        return time.getDate() + "." + (time.getMonth() + 1) + "." + time.getFullYear();
    }
}

module.exports = Display;