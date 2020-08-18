/**
 * mdDisp - Markdown Parser and Viewer
 * @author Robert Fromm
 * @data 14.08.2020
 * 
 * Server Side Javascript:
 * Rendering the image in the markdown file. Using DOM manipulation to interpret and apply the
 * attributes in the alt text of the image.
 */

/**
 * Constructor.
 * 
 * @param {dict} options markdown parsing options
 * @param {LabelRenderer} labelRenderer LabelRenderer for applying a image label
 */
var ImageRenderer = function (options, labelRenderer) {
    this.options = options;
    this.labelRenderer = labelRenderer;
}

/**
 * Rendering an image.
 * 
 * @param {jquery} $ 
 * @param {*} img jquery image tag
 */
ImageRenderer.prototype.render = function ($, img) {
    // read alt text
    json = Util.fixJson($(img).attr("alt"));
    if (!json) return;

    // Wrap with div
    let div = $("<div>");
    div.addClass("md_img_div");
    img.addClass("md_img");
    img.wrap(div);
    div = img.parent();


    this.setWidth($, json, div, img);
    this.setCaption($, json, div, img);

    // set onclick function
    img.attr("onclick", "img_box(this)");
}

/**
 * Setting the with of the image.
 * 
 * @param {jquery} $ 
 * @param {dict} json parsed alt text
 * @param {*} div surrounding div
 * @param {*} img image tag
 */
ImageRenderer.prototype.setWidth = function ($, json, div, img) {
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
}

/**
 * Setting the caption and source text of the image.
 * 
 * @param {jquery} $ 
 * @param {dict} json parsed alt text
 * @param {*} div surrounding div
 * @param {*} img image tag
 */
ImageRenderer.prototype.setCaption = function ($, json, div, img) {
    if (!("alt" in json)) {
        img.attr("alt", "");
        return;
    }

    img.attr("alt", json["alt"]);

    let caption = $("<span>");
    caption.addClass("md_img_caption");
    caption.html(json["alt"]);
    div.append(caption);

    // Label
    if (this.options["autolabel_img"] || ("label" in json)) {
        let label = "!fig";
        if ("label" in json) {
            label = "!" + json["label"];
        }
        let element = $("<em>").text(label);
        element = this.labelRenderer.renderLabel($, element);
        caption.prepend(" ");
        caption.prepend(element);
    }

    // Source
    if (!("src" in json)) {
        return;
    }

    caption.append("<br>");
    let source = $("<span>");
    source.addClass("md_img_caption_src");
    source.text(this.options["img_src_text"].replace("#SRC", json["src"]));
    caption.append(source);
}

module.exports = ImageRenderer;