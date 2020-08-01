let lastUpdateTimeStamp = -1;

$(document).ready(function () {
    request();
});

function request() {
    window.setTimeout(request, 1000);
    $.getJSON("/refresher/" + autoRefresherId, update);
}

function update(res) {
    console.log(res);

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