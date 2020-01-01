const OPTION_HEADER = "!mdDisp:";
const TEMPLATE = "templates/template.html";
const AUTHOR_TAG = '<meta name="author" content="#AUTHOR">';

const markdown_it = require("markdown-it");
const markdown_it_mathjax = require('markdown-it-mathjax');
const markdown_it_container = require('markdown-it-container');
const fs = require("fs");
const hljs = require('highlight.js');
const default_options = require("./templates/default-options.json")
const jsdom = require("jsdom");
const jquery = require('jquery');

var Renderer = function (filename, destination) {
    this.filename = filename;
    this.destination = destination;
    fs.readFile(filename, "utf8", this.parseFile.bind(this));
}

Renderer.prototype.parseFile = function (err, data) {
    this.data = data;
    let start = this.parseOptions();
    this.data = this.data.substring(start);

    this.md = markdown_it({
        html: true,
        xhtmlOut: false,
        breaks: true,
        langPrefix: "language-",
        linkify: false,
        typographer: false,
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, str).value;
                } catch (__) { }
            }

            return ''; // use external default escaping
        }
    });

    this.md.use(markdown_it_mathjax());

    for (container of this.options["simple-containers"]) {
        this.md.use(markdown_it_container, container);
    }

    this.result = this.md.render(this.data);

    this.createHtml();

    this.modifyHtml();

    fs.writeFile(this.destination, this.result, "utf8", function () {
        console.log("ready");
    });
}

Renderer.prototype.parseOptions = function () {
    let firstLine = this.data.split("\n", 1)[0];

    if (!firstLine.startsWith(OPTION_HEADER)) {
        this.options = default_options;
        return 0;
    }


    json = this.fixJson(firstLine.substring(OPTION_HEADER.length).trim("\r"));

    if (json == null) {
        this.options = default_options;
        this.data = "<p style='color: red; font-weight: bold;'>[Error in header]</p>\n" + this.data.substring(firstLine.length);
        return 0;
    }

    this.options = Object.assign(Object.assign({}, default_options), json);
    return firstLine.length;
}

Renderer.prototype.fixJson = function (string) {
    // von https://www.quora.com/How-can-I-parse-unquoted-JSON-with-JavaScript
    try {
        let crappyJSON = "{" + string + "}";
        let fixedJSON = crappyJSON.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ')
        return JSON.parse(fixedJSON);
    } catch (e) {
        return null;
    }
}

Renderer.prototype.createHtml = function () {
    template = fs.readFileSync(TEMPLATE, "utf8");

    // BODY
    this.result = template.replace("#BODY", this.result);

    // AUTHOR
    let authorTag = "";
    if (this.options["author"]) {
        authorTag = AUTHOR_TAG.replace("#AUTHOR", this.options["author"]);
    }
    this.result = this.result.replace("#AUTHOR_TAG", authorTag)

    // TITLE
    this.result = this.result.replace("#TITLE", this.options["title"]);

    // CSS
    let cssTags = "";

    let cssFile = "templates/" + this.options["style"];
    if (fs.existsSync(cssFile)) {
        cssTags += "<style>\n" + fs.readFileSync(cssFile, "utf8") + "</style>\n";
    } else {
        cssTags += '<link href="' + this.options["style"] + '" rel="stylesheet">';
    }

    this.result = this.result.replace("#CSS", cssTags);
}

Renderer.prototype.modifyHtml = function () {
    let dom = new jsdom.JSDOM(this.result);
    let $ = jquery(dom.window);

    this.addTitle($);
    this.setPageWidth($);
    this.updateImages($);

    this.result = dom.serialize();
}

Renderer.prototype.addTitle = function ($) {
    if (this.options["title"]) {
        $("#md").prepend(
            $("<h1>").text(this.options["title"])
        );
    }
}

Renderer.prototype.setPageWidth = function ($) {
    if (this.options["pagewidth"]) {
        $("#md").css("width", this.options["pagewidth"]);
    }
}

Renderer.prototype.updateImages = function ($) {
    $("#md img").each(function (index, element) {
        img = $(element);
        json = this.fixJson($(img).attr("alt"));
        if (!json) return;

        // Wrap mit div
        div = $("<div>");
        div.addClass("md_img_div");
        img.addClass("md_img");

        // Größe
        if ("w" in json) {
            let w = json["w"];

            if (typeof w == "number") {
                w--;
                div.css("width", w + "%");
            } else {
                div.css("width", w);
            }
        } else {
            div.css("width", "100%");
        }

        img.wrap(div);
        div = img.parent()

        // Alt
        if ("alt" in json) {
            img.attr("alt", json["alt"]);

            let caption = $("<span>");
            caption.addClass("md_img_caption");
            caption.html(json["alt"]);

            // Source
            if ("src" in json) {
                caption.append("<br>");
                let source = $("<span>");
                source.addClass("md_img_caption_src");
                source.text(this.options["img-src-text"].replace("#SRC", json["src"]));
                caption.append(source);
            }

            div.append(caption);
        } else {
            img.attr("alt", "");
        }

        // Modal
        img.attr("onclick", "img_box(this)");

    }.bind(this));
}

module.exports = Renderer;