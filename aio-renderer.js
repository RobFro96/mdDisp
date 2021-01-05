/**
 * mdDisp - Markdown Parser and Viewer
 * @author Robert Fromm
 * @data 14.08.2020
 * 
 * Server Side Javascript:
 * Exporting a All-In-One HTML. All styling and code files are included in the .html file.
 * But images must be uploaded seperatly.
 */

const fs = require("fs");
const path = require("path");

/**
 * Constructor.
 *  
 * @param {lowd} config Global configuration as lowdb object.
 * @param {Folder} folder Corresponding folder of file.
 * @param {string} file path of the markdown file.
 */
var AioRender = function (config, folder, file) {
    this.config = config;
    this.folder = folder;
    this.file = file;
}

/**
 * Function to render the all in one html file.
 * Note: JSON preview file must be created first.
 * 
 * Reading the JSON preview file.
 * Reading the template file
 * Filling all placeholders in template file, reading files if needed.
 * Writing output file
 */
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

        let outputPath = path.join(path.parse(this.file).dir, outputFilename);

        fs.writeFileSync(outputPath, this.html, { encoding: 'utf8' });
    } catch (e) {
        return "Error while reading the template file.\n" + e.stack;
    }

    console.log(`AIO-Rendering of ${this.file} successful.`);
    return "";
}

/**
 * Replacing all placeholders with the value.
 * 
 * @param {string} placeholder placehold to be replaced with value
 * @param {string} value value to be inserted
 */
AioRender.prototype.replace = function (placeholder, value) {
    this.html = this.html.replace(new RegExp(placeholder, "g"), value);
}

/**
 * Replace the #pagewidth_tag.
 * If pagewidth is set, add a style="..." tag.
 * else remove placeholder.
 */
AioRender.prototype.replacePageWidth = function () {
    let tag = "";

    if (this.previewJson.pagewidth) {
        tag = `style="width: ${this.previewJson.pagewidth};"`
    }

    this.replace("#pagewidth_tag", tag);
}

/**
 * Replace the placeholder with the content of the file.
 * 
 * @param {string} placeholder placeholder
 * @param {string} file path to file
 */
AioRender.prototype.replaceWithFile = function (placeholder, file) {
    try {
        let content = fs.readFileSync(file, "utf8");
        this.replace(placeholder, content);
    } catch (e) {
        return `Error while reading the file ${file}.\n` + e.stack;
    }
}

/**
 * Replace the #style_sheets placeholder with the content of the specified stylesheets.
 */
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