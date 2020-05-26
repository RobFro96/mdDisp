const OPTION_HEADER = "!mdDisp:";

const markdown_it = require("markdown-it");
const markdown_it_mathjax = require('markdown-it-mathjax');
const markdown_it_container = require('markdown-it-container');
const Util = require("./util");
const DomRenderer = require("./dom-renderer");


const fs = require("fs");
const hljs = require('highlight.js');
// const default_options = require("./templates/default-options.json")

var Renderer = function (mdFile, previewFile, default_options) {
    this.mdFile = mdFile;
    this.previewFile = previewFile;
    this.default_options = default_options;
}

Renderer.prototype.render = function () {
    try {
        this.mdContent = fs.readFileSync(this.mdFile, "utf8");
        let firstLine = this.mdContent.split("\n", 1)[0];

        if (!firstLine.startsWith(OPTION_HEADER)) {
            this.options = this.default_options;
        }

        let start = this.parseOptions(firstLine);
        this.mdContent = this.mdContent.substring(start);

        // Einstellungen
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

        this.enableMathJax();
        this.enableContainer();
        this.enableSpoiler();

        let html = this.md.render(this.mdContent);
        html = `<div id="md">${html}</div>`
        let result = new DomRenderer(this.options).render(html);

        fs.writeFileSync(this.previewFile, result, "utf8");
    } catch (e) {
        return e.stack;
    }

    return null;
}

Renderer.prototype.parseOptions = function (firstLine) {
    json = Util.fixJson(firstLine.substring(OPTION_HEADER.length).trim("\r"));

    if (json == null) {
        this.options = this.default_options;
        this.mdContent = "<p style='color: red; font-weight: bold;'>[Error in header]</p>\n" + this.mdContent.substring(firstLine.length);
        return 0;
    }

    this.options = Object.assign(this.default_options, json);
    return firstLine.length;
}

Renderer.prototype.enableMathJax = function () {
    this.md.use(markdown_it_mathjax());
}

Renderer.prototype.enableContainer = function () {
    for (container of this.options["simple-containers"]) {
        this.md.use(markdown_it_container, container);
    }
}

Renderer.prototype.enableSpoiler = function () {
    this.md.use(markdown_it_container, "spoiler", {
        validate: function (params) {
            return params.trim().match(/^spoiler\s+(.*)$/);
        },

        render: function (tokens, idx) {
            var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

            if (tokens[idx].nesting === 1) {
                // opening tag
                return '<details><summary>' + this.md.utils.escapeHtml(m[1]) + '</summary>\n';

            } else {
                // closing tag
                return '</details>\n';
            }
        }.bind(this)
    });
}

module.exports = Renderer;