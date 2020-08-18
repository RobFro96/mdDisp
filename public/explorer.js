/**
 * mdDisp - Markdown Parser and Viewer
 * @author Robert Fromm
 * @data 14.08.2020
 * 
 * Client Side Javascript:
 * Logic if an item in the explorer was clicked.
 * If type of item is a link, then the href is threaded as an hyperlink.
 * If type of item is an image, then the img_box is opened (see img_box.js).
 */

jQuery(document).ready(function ($) {
    $(".tr-clickable").click(function () {
        switch ($(this).data("type")) {
            case "link":
                window.location = $(this).data("href");
                break;
            case "image":
                img_box($(this).data("href"));
                break;
            default:
                break;
        }
    });
});