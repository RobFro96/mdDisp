const string_hash = require("string-hash");

var AutoRefresher = function () {
    this.files = {};
}

AutoRefresher.prototype.getHash = function (mdfile) {
    return String(string_hash(mdfile));
}

AutoRefresher.prototype.onUpdate = function (mdfile) {
    this.files[this.getHash(mdfile)] = Date.now();
}

AutoRefresher.prototype.route = function (req, res) {
    let hash = req.params.id;

    if (hash in this.files) {
        res.send(String(this.files[hash]));
    } else {
        res.send("0");
    }
}

module.exports = AutoRefresher;