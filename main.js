const chokidar = require("chokidar");
const fs = require("fs");
const Renderer = require("./renderer");

const express = require('express');
const Http = require('http')

const CONFIG_FILE = "config.json";

var Main = function () {
    this.watcher = [];
    this.files = {};

    this.configWatcher = chokidar.watch(CONFIG_FILE, { persistent: true });
    this.configWatcher.on('change', this.updateConfig.bind(this));
    this.updateConfig();

    this.app = express();
    this.http = Http.Server(this.app);
    this.app.use("/", express.static("./public/"));
    this.app.get('/update', this.onUpdateRequest.bind(this));
    this.http.listen(8080, "localhost", function () {
        console.log("Listening on localhost:8080");
    });

}

Main.prototype.updateConfig = function () {
    console.info(`Update config file: ${CONFIG_FILE}.`);

    let config = {};
    try {
        let content = fs.readFileSync(CONFIG_FILE, "utf8");
        config = JSON.parse(content);
    } catch (e) {
        console.error(e);
        return;
    }

    // Alle alten Watcher deaktivieren!
    for (let watcher of this.watcher) {
        watcher.close();
    }
    this.watcher = []

    // Neue Watcher erstellen
    for (let path of config["paths"]) {
        let watcher = chokidar.watch(path + "/**/*.md", { persistent: true });
        watcher.on('add', this.updateFile.bind(this))
            .on('change', this.updateFile.bind(this));

        this.watcher.push(watcher);
    }
}

Main.prototype.updateFile = function (path) {
    let htmlFilename = path.substring(0, path.length - 2) + "html";

    if (fs.existsSync(htmlFilename)) {
        let mdStats = fs.statSync(path);
        let htmlStats = fs.statSync(htmlFilename);

        if (mdStats.mtime <= htmlStats.mtime) {
            return;
        }
    }

    console.info(`Updating markdown file ${path}.`);
    renderer = new Renderer(path, htmlFilename);
    let result = renderer.render();
    if (!result) {
        console.info(`...failed.`);
        return;
    }

    console.info(`...finished.`);
    let filename = htmlFilename.replace(/\\/g, "/").split("/");
    filename = filename[filename.length - 1];
    this.files[filename] = Date.now();
}

Main.prototype.onUpdateRequest = function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.json(this.files);
}

main = new Main();