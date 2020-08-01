const fs = require("fs");
const express = require('express');
const Http = require('http');

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
    fs.unlinkSync("config.json");
    this.config = low(new FileSync("config.json"));
    this.config.defaults(require("./default-config.json")).write();

    this.autoRefresher = new AutoRefresher();

    this.folders = new Folders(this.config, this.autoRefresher);

    this.display = new Display(this.config, this.folders, this.autoRefresher);
}

// Starten des Konstruktors
main = new Main();