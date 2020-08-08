const fs = require("fs");
const chokidar = require("chokidar");

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const Folders = require("./folders");
const Display = require("./display");
const AutoRefresher = require("./auto-refresher")

/**
 * Konstruktor von Main.
 * Initialisierung des Programms
 */
var Main = function () {
    // Datenbank
    this.config = low(new FileSync("config.json"));
    this.config.defaults(require("./default-config.json")).write();

    this.watcher = chokidar.watch("config.json", { persistent: true });
    this.watcher.on("change", this.onConfigChanged.bind(this));

    this.autoRefresher = new AutoRefresher();

    this.refresh();
}

Main.prototype.onConfigChanged = function () {
    this.folders.closeAll();
    this.display.close();
    this.config = low(new FileSync("config.json"));
    this.config.defaults(require("./default-config.json"));

    this.refresh();
}

Main.prototype.refresh = function () {
    this.folders = new Folders(this.config, this.autoRefresher);
    this.display = new Display(this.config, this.folders, this.autoRefresher);
}

// Starten des Konstruktors
main = new Main();