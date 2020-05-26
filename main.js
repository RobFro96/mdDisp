const fs = require("fs");
const express = require('express');
const Http = require('http');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const Folders = require("./folders");
const Display = require("./display");
const Files = require("./files");

var Main = function () {
    fs.unlinkSync("config.json");

    this.config = low(new FileSync("config.json"));
    this.config.defaults(require("./default-config.json")).write();

    this.folders = new Folders(this.config);

    this.files = new Files(this.config, this.folders);
    this.display = new Display(this.config, this.files);


    this.app = express();
    this.http = Http.Server(this.app);
}



main = new Main();