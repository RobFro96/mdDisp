var ImageRenderer = function (options, labelRenderer) {
    this.options = options;
    this.labelRenderer = labelRenderer;
}

ImageRenderer.prototype.render = function ($, img) {
    // Alt auslesen
    json = Util.fixJson($(img).attr("alt"));
    if (!json) return;

    // Wrap mit div
    let div = $("<div>");
    div.addClass("md_img_div");
    img.addClass("md_img");
    img.wrap(div);
    div = img.parent();


    this.setWidth($, json, div, img);
    this.setCaption($, json, div, img);

    // Modal
    img.attr("onclick", "img_box(this)");
}

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