jQuery(document).ready(function ($) {
    $("#aio-render").click(function () {
        $.getJSON(renderLink);
    });
});