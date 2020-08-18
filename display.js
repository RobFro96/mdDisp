/**
 * mdDisp - Markdown Parser and Viewer
 * @author Robert Fromm
 * @data 14.08.2020
 * 
 * Server Side Javascript:
 * Display class for viewing the explorer and markdown preview.
 * Creating an express server. Port is specified in the config.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const AioRenderer = require("./aio-renderer");
const Util = require("./util");

/**
 * Constructor.
 * Connecting all endpoint routing functions. Starting the express.js server.
 * 
 * @param {lowdb} config global config as lowdb object
 * @param {Folders} folders folders of installation
 * @param {AutoRefresher} autoRefresher autorefresher of installation
 */
var Display = function (config, folders, autoRefresher) {
    this.config = config;
    this.folders = folders;
    this.autoRefresher = autoRefresher;

    this.app = express();
    this.app.set('view-engine', 'ejs');
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.static('public'));

    this.app.use('/styles', express.static('styles'));
    this.app.get('/', this.routeRoot.bind(this));
    this.app.get('/files/:folder', this.routeFiles.bind(this));
    this.app.get('/files/:folder/:path(*)', this.routeFiles.bind(this));
    this.app.get('/file/:folder/:path(*)', this.routeFile.bind(this));
    this.app.get('/render/:folder/:path(*)', this.routeAioRender.bind(this));
    this.app.get('/refresher/:id', this.autoRefresher.route.bind(this.autoRefresher));

    // Handle 404
    this.app.use(function (req, res) {
        res.status(404).send('404: Page not Found @RF');
    });

    this.server = this.app.listen(this.config.get("web_port").value());
    console.log(`Listining on port ${this.config.get("web_port").value()}.`)
}

/**
 * Close the server.
 */
Display.prototype.close = function () {
    this.server.close();
}

/**
 * Default endpoint. Rendering explorer with an overview of all folders.
 * 
 * @param {*} req request
 * @param {*} res response
 */
Display.prototype.routeRoot = function (req, res) {
    let data = {};
    data.title = "mdDisp - /";
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

/**
 * Rendering the explorer with an specified folder.
 * 
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next
 */
Display.prototype.routeFiles = function (req, res, next) {
    let data = {};

    let folder = req.params.folder;
    let subPath = req.params.path || "";

    if (!this.folders.folderExists(folder)) {
        return next();
    }

    data.location = folder + "/";
    if (subPath) data.location += subPath + "/";

    data.title = "mdDisp - " + data.location;

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
                    lastModified: Util.formatTime(stats.ctime),
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

/**
 * Sending a file, or showing the preview of a markdown file.
 * 
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next
 */
Display.prototype.routeFile = function (req, res, next) {
    let folder = req.params.folder;
    let subPath = req.params.path || "";

    if (!this.folders.folderExists(folder)) {
        return next();
    }


    let file = path.join(this.folders.getFolderPath(folder), subPath);
    let extension = path.parse(file).ext

    // normal file
    if (extension != ".md") {
        return res.sendFile(file, { dotfiles: 'allow' }, function (err) {
            if (err) {
                return next();
            }
        });
    }

    // markdown
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
        data.title = "mdDisp - " + json.title;
        data.location = folder + "/" + subPath;
        data.content = json.html;
        data.toc = Util.formatToc(json.toc);
        data.author = json.author;
        data.mathjax_macros = this.config.get("mathjax_macros").value().join("\n");
        data.autoRefresherId = this.autoRefresher.getHash(file);
        data.styles = json.styles || [];
        data.renderLink = "/render/" + folder + "/" + subPath;
        data.pagewidth = json.pagewidth != 0;

        res.render("preview.ejs", data);
    }.bind(this));
}

/**
 * Endpoint for creating the Aio-File.
 * Checking folder and file path, starting the rendering, returning an error code.
 * 
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next
 */
Display.prototype.routeAioRender = function (req, res, next) {
    let folder = req.params.folder;
    let subPath = req.params.path || "";

    if (!this.folders.folderExists(folder)) {
        return next();
    }


    let file = path.join(this.folders.getFolderPath(folder), subPath);
    let extension = path.parse(file).ext;

    if (extension != ".md") {
        return next();
    }

    let renderer = new AioRenderer(this.config, this.folders.folders[folder], file);
    let result = renderer.render();

    if (result)
        console.log(`AIO-Rendering ${file} returned ${result}.`)

    res.send({ "result": result });
}

module.exports = Display;