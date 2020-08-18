/**
 * mdDisp - Markdown Parser and Viewer
 * @author Robert Fromm
 * @data 14.08.2020
 * 
 * Server Side Javascript:
 * Main Program. Using a main class to start the program.
 * Refreshing of main configuration in case of a file change is handled here.
 */

const chokidar = require("chokidar");

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const Folders = require("./folders");
const Display = require("./display");
const AutoRefresher = require("./auto-refresher")

/**
 * Constructor. Starting the Program.
 */
var Main = function () {
    // Datenbank
    this.config = low(new FileSync("config.json"));
    this.config.defaults(require("./default-config.json")).write();

    this.watcher = chokidar.watch("config.json", { persistent: true });
    this.watcher.on("change", this.onConfigChanged.bind(this));

    this.autoRefresher = new AutoRefresher();

    this.restart();
}

/**
 * Change in configuration file detected. Closing all current watchers and server.
 * Loading new config. Restarting the server.
 */
Main.prototype.onConfigChanged = function () {
    this.folders.closeAll();
    this.display.close();
    this.config = low(new FileSync("config.json"));
    this.config.defaults(require("./default-config.json"));

    this.restart();
}

/**
 * Restarting the Server and opening the Folder.
 */
Main.prototype.restart = function () {
    this.folders = new Folders(this.config, this.autoRefresher);
    this.display = new Display(this.config, this.folders, this.autoRefresher);
}

// Start program by calling the constructor.
main = new Main();