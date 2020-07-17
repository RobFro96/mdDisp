const fs = require("fs");
const express = require('express');
const Http = require('http');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const Folders = require("./folders");
const Display = require("./display");
const Files = require("./files");

/**
 * Konstruktor von Main.
 * Initialisierung des Programms
 */
var Main = function () {
    // Datenbank
    fs.unlinkSync("config.json");
    this.config = low(new FileSync("config.json"));
    this.config.defaults(require("./default-config.json")).write();



    this.folders = new Folders(this.config);

    this.display = new Display(this.config, this.folders);
}

// Starten des Konstruktors
main = new Main();