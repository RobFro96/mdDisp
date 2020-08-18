/**
 * mdDisp - Markdown Parser and Viewer
 * @author Robert Fromm
 * @data 14.08.2020
 * 
 * Client Side Javascript:
 * Logic for automatic page refresh, when a markdown file was changed and updated.
 * Sending a request to refresher/-API once every second.
 */
let lastUpdateTimeStamp = -1;

$(document).ready(function () {
    request();
});

function request() {
    window.setTimeout(request, 1000);
    $.getJSON("/refresher/" + autoRefresherId, update);
}

function update(res) {
    if (res == null) {
        return;
    }

    if (lastUpdateTimeStamp == -1) {
        lastUpdateTimeStamp = res;
    }

    if (lastUpdateTimeStamp != res) {
        lastUpdateTimeStamp = res;
        document.location.reload();
    }
}