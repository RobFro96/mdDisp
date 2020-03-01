

const express = require('express');
const Http = require('http')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const Folders = require("./folders")

var Main = function () {
    this.config = low(new FileSync("config.json"))
    this.config.defaults(require("./default-config.json")).write();

    this.folders = new Folders(this.config)


    this.app = express();
    this.http = Http.Server(this.app);
}



main = new Main();