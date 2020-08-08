const { compareSync } = require("bcrypt");
const fs = require("fs");
const path = require("path");
const { json } = require("express");

var AioRender = function (config, folder, file) {
    this.config = config;
    this.folder = folder;
    this.file = file;
}

AioRender.prototype.render = function () {
    let previewFile = this.folder.getPreviewFilename(this.file);

    try {
        this.previewJson = JSON.parse(fs.readFileSync(previewFile, "utf8"));
    } catch (e) {
        return "Error while reading the preview file.\n" + e.stack;
    }

    try {
        this.html = fs.readFileSync(path.join("templates",
            this.folder.folderConfig.get("aio-renderer-template").value()), "utf-8");
    } catch (e) {
        return "Error while reading the template file.\n" + e.stack;
    }

    this.replace("#title", this.previewJson.title);
    this.replace("#mathjax_macros", this.config.get("mathjax_macros").value().join("\n"));
    this.replace("#table_of_content", Util.formatToc(this.previewJson.toc));
    this.replace("#md-body", this.previewJson.html);
    this.replacePageWidth();
    result = this.replaceWithFile("#img_box_js", "public/img_box.js");
    if (result) return result;

    result = this.replaceWithFile("#mathjax_config", "public/mathjax-config.js");
    if (result) return result;

    result = this.replaceStylesheets();
    if (result) return result;


    try {
        let filename = path.parse(this.file).name;
        let outputFilename = this.folder.folderConfig.get("aio-renderer-output").value()
            .replace("#filename", filename);

        let outputPath = path.join(this.folder.path, outputFilename);

        fs.writeFileSync(outputPath, this.html, { encoding: 'utf8' });
    } catch (e) {
        return "Error while reading the template file.\n" + e.stack;
    }

    console.log(`AIO-Rendering of ${this.file} successfull.`);
    return "";
}

AioRender.prototype.replace = function (placeholder, value) {
    this.html = this.html.replace(new RegExp(placeholder, "g"), value);
}

AioRender.prototype.replacePageWidth = function () {
    let tag = "";

    if (this.previewJson.pagewidth) {
        tag = `style="width: ${this.previewJson.pagewidth};"`
    }

    this.replace("#pagewidth_tag", tag);
}

AioRender.prototype.replaceWithFile = function (placeholder, file) {
    try {
        let content = fs.readFileSync(file, "utf8");
        this.replace(placeholder, content);
    } catch (e) {
        return `Error while reading the file ${file}.\n` + e.stack;
    }
}

AioRender.prototype.replaceStylesheets = function () {
    let css = "<style>";

    for (let stylesheet of this.previewJson.styles || []) {
        let stylesheetPath = path.join("styles", stylesheet);

        try {
            let content = fs.readFileSync(stylesheetPath, "utf8");
            css += content + "\n";
        } catch (e) {
            return `Error while reading the file ${file}.\n` + e.stack;
        }
    }

    css += "</style>";

    this.replace("#style_sheets", css);
}

module.exports = AioRender;