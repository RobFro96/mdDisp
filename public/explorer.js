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