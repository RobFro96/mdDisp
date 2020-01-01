const chokidar = require("chokidar");
const fs = require("fs");
const Renderer = require("./renderer");

var Main = function () {
    this.path = "";
    let myargs = process.argv.slice(2);
    if (myargs.length >= 1) {
        this.path = myargs[0];
    }

    this.enableWatcher();
}

Main.prototype.enableWatcher = function () {
    this.watcher = chokidar.watch(this.path + "/**/*.md", { persistent: true });
    this.watcher.on('add', this.updateFile.bind(this))
        .on('change', this.updateFile.bind(this));
}

Main.prototype.updateFile = function (path) {
    let htmlFilename = path.substring(0, path.length - 2) + "html";

    if (fs.existsSync(htmlFilename) && false) {
        let mdStats = fs.statSync(path);
        let htmlStats = fs.statSync(htmlFilename);

        if (mdStats.mtime <= htmlStats.mtime) {
            return;
        }
    }

    console.log(`updating ${path}.`);
    renderer = new Renderer(path, htmlFilename);
}


main = new Main();