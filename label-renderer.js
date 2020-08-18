/**
 * mdDisp - Markdown Parser and Viewer
 * @author Robert Fromm
 * @data 14.08.2020
 * 
 * Server Side Javascript:
 * Rendering the Labels and References by using DOM manipulation and labels.
 */

/**
 * Constuctor.
 * Setting up all labelNumbers and sectionNumbers to zero.
 * @param {dict} options markdown parsing options
 */
var LabelRenderer = function (options) {
    this.options = options;

    this.labelNumbers = {};
    this.labels = {};
    for (let label in this.options["labels"]) {
        this.labelNumbers[label] = 0;
    }

    this.sectionNumbers = new Array(this.options["section_depth"]).fill(0);
    this.useChapter = this.options["chapter"] > 0;

    this.toc = [];
    this.tocLists = new Array(this.options["section_depth"]).fill(null);
    this.tocLists[0] = this.toc;

    if (this.useChapter) {
        this.sectionNumbers[0] = this.options["chapter"] - 1;
    }
}

/**
 * Finding out label type.
 * Creating the id for reference.
 * @param {jquery} $
 * @param {*} element jquery element containing a label.
 */
LabelRenderer.prototype.renderLabel = function ($, element) {
    let innerText = element.text();
    if (innerText[0] != "!")
        return;

    element = this.replaceTag($, element, "span");
    element.addClass("label");

    let split = innerText.substring(1).split(":");
    let type = split[0];

    if (!(type in this.labelNumbers)) {
        element.text("[Unknown label type]");
        element.css("color", "red");
        return element;
    }

    if (type == "sec") {
        let text = this.options["labels"]["sec"] + " " + this.sectionNumbers[0];
        for (let i = 1; i < this.options["section_depth"]; i++) {
            if (this.sectionNumbers[i] == 0)
                break;
            text += "." + this.sectionNumbers[i];
        }

        let label = innerText.substring(1);
        element.text("");
        element.attr("id", label);
        this.labels[label] = text;
    } else {
        this.labelNumbers[type]++;
        let text = this.options["labels"][type] + " ";
        if (this.useChapter) {
            text += this.sectionNumbers[0] + ".";
        }
        text += this.labelNumbers[type];
        element.text(text);

        if (split.length > 1) {
            let label = innerText.substring(1);
            this.labels[label] = text;
            element.attr("id", label);
        }
    }
    return element;
}

/**
 * Searching for label in Database.
 * Refering to label, adding a hyperlink.
 * @param {jquery} $ 
 * @param {*} element jquery element contain a label
 */
LabelRenderer.prototype.renderRef = function ($, element) {
    let innerText = element.text();
    if (innerText[0] != "?")
        return;

    element = this.replaceTag($, element, "a");
    element.addClass("ref");

    let label = innerText.substring(1);
    if (!(label in this.labels)) {
        element.text("[Unknown label: " + label + "]");
        element.css("color", "red");
        return;
    }

    element.text(this.labels[label]);
    element.attr("href", "#" + label);
}

/**
 * Adding numbering to heading.
 * Adding entry to table of contents.
 * @param {jquery} $ 
 * @param {*} element jquery tag of heading
 */
LabelRenderer.prototype.renderHeading = function ($, element) {
    if (!this.options["autolabel_heading"])
        return;

    let tag = element.prop("tagName");
    let level = parseInt(tag.substring(tag.length - 1)) - 1;

    if (!this.useChapter) {
        level--;
    }

    if (level == NaN || level >= this.options["section_depth"] || level < 0)
        return;

    this.sectionNumbers[level]++;
    for (let i = level + 1; i < this.options["section_depth"]; i++) {
        this.sectionNumbers[i] = 0;
    }

    let text = this.sectionNumbers[0] + ".";
    let id = "sec:" + this.sectionNumbers[0];

    for (let i = 1; i <= level; i++) {
        if (i != 1) {
            text += ".";
        }
        id += "-";

        text += this.sectionNumbers[i];
        id += this.sectionNumbers[i];
    }

    let tocObj = {
        "text": element.html(),
        "numbers": text,
        "link": id,
        "children": []
    };

    this.tocLists[level].push(tocObj);
    this.tocLists[level + 1] = tocObj.children;

    let span = $("<span>");
    span.text(text);
    span.addClass("heading_label");

    element.prepend(span);
    element.attr("id", id);
}

/**
 * Replacing the html tag of the given element.
 * 
 * @param {jquery} $ 
 * @param {*} element element
 * @param {string} tag new tag
 */
LabelRenderer.prototype.replaceTag = function ($, element, tag) {
    let newElement = $("<" + tag + ">" + element.html() + "</" + tag + ">");
    element.replaceWith(newElement);
    return newElement;
}

module.exports = LabelRenderer;