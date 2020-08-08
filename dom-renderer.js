const jsdom = require("jsdom");
const jquery = require("jquery");
const ImageRenderer = require("./image-renderer");
const LabelRenderer = require("./label-renderer");

var DomRenderer = function (options) {
    this.options = options;
}

DomRenderer.prototype.render = function (fullHtml) {
    let dom = new jsdom.JSDOM(fullHtml);
    let $ = jquery(dom.window);

    this.addTitle($);
    this.setPageWidth($);

    let labelRenderer = new LabelRenderer(this.options);
    let imageRenderer = new ImageRenderer(this.options, labelRenderer);

    // label
    $("#md img, em, h1, h2, h3, h4, h5, h6").each(function (index, element) {
        let jqElement = $(element);

        switch (jqElement.prop("tagName")) {
            case "IMG":
                imageRenderer.render($, jqElement);
                break;
            case "EM":
                labelRenderer.renderLabel($, jqElement);
                break;
            case "H1":
            case "H2":
            case "H3":
            case "H4":
            case "H5":
            case "H6":
                labelRenderer.renderHeading($, jqElement);
                break;
        }

    }.bind(this));

    // ref
    $("#md em").each(function (index, element) {
        let jqElement = $(element);

        switch (jqElement.prop("tagName")) {
            case "EM":
                labelRenderer.renderRef($, jqElement);
                break;
        }

    }.bind(this));

    let html = dom.window.document.body.innerHTML;

    // fix toc
    let toc = labelRenderer.toc;
    if (labelRenderer.useChapter) {
        toc = toc[0].children;
    }

    // create styles
    let styles = ["default.css", "default-code.css"];
    if (Array.isArray(styles)) {
        for (let style of this.options["styles"]) {
            styles.push(style);
        }
    }

    if ("style" in this.options) {
        styles.push(this.options["style"]);
    }

    let json = {
        html: html,
        title: this.options["title"],
        pagewidth: this.options["pagewidth"],
        author: this.options["author"],
        styles: styles,
        toc: toc
    }

    return json;
}

DomRenderer.prototype.addTitle = function ($) {
    if (this.options["title"]) {
        $("#md").prepend(
            $("<h1>").text(this.options["title"])
        );
    }
}

DomRenderer.prototype.setPageWidth = function ($) {
    if (this.options["pagewidth"]) {
        $("#md").css("width", this.options["pagewidth"]);
    }
}

module.exports = DomRenderer;