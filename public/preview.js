/**
 * mdDisp - Markdown Parser and Viewer
 * @author Robert Fromm
 * @data 14.08.2020
 * 
 * Client Side Javascript:
 * Logic if #aio-render button was pressed: Sending a request.
 */

jQuery(document).ready(function ($) {
    $("#aio-render").click(function () {
        $.getJSON(renderLink);
    });
});