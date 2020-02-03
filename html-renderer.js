const TEMPLATE = "templates/template.html";
const AUTHOR_TAG = '<meta name="author" content="#AUTHOR">';

const fs = require("fs");

var HtmlRenderer = function (options) {
    this.options = options;
}

HtmlRenderer.prototype.render = function (bodyHtml) {
    template = fs.readFileSync(TEMPLATE, "utf8");

    // BODY
    this.result = template.replace("#BODY", bodyHtml);

    this.setAuthor();
    this.setTitle();
    this.setCss();

    return this.result;
}

HtmlRenderer.prototype.setAuthor = function () {
    let authorTag = "";
    if (this.options["author"]) {
        authorTag = AUTHOR_TAG.replace("#AUTHOR", this.options["author"]);
    }

    this.result = this.result.replace("#AUTHOR_TAG", authorTag)
}

HtmlRenderer.prototype.setTitle = function () {
    this.result = this.result.replace("#TITLE", this.options["title"]);
}

HtmlRenderer.prototype.setCss = function () {
    let cssTags = "";

    let cssFile = "templates/" + this.options["style"];
    if (fs.existsSync(cssFile)) {
        cssTags += "<style>\n" + fs.readFileSync(cssFile, "utf8") + "</style>\n";
    } else {
        cssTags += '<link href="' + this.options["style"] + '" rel="stylesheet">';
    }

    this.result = this.result.replace("#CSS", cssTags);
}

module.exports = HtmlRenderer;