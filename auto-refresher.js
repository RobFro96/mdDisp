/**
 * mdDisp - Markdown Parser and Viewer
 * @author Robert Fromm
 * @data 14.08.2020
 * 
 * Server Side Javascript:
 * Logic for the autorefresher:
 *  Hashing the path of the markdown file.
 *  Adding hash and current timestamp in ms to a dictionary.
 */

const string_hash = require("string-hash");

/**
 * Constructor.
 * Clearing dictionary files.
 */
var AutoRefresher = function () {
    this.files = {};
}

/**
 * Returning hash of the markdown file.
 * 
 * @param {string} mdfile path of the markdown file
 * @returns {string} hash of given string.
 */
AutoRefresher.prototype.getHash = function (mdfile) {
    return String(string_hash(mdfile));
}

/**
 * Function to be called on refresh of the markdown file.
 * Adding or Updating hash to current date of the dictionary.
 * 
 * @param {string} mdfile path of markdown file.
 */
AutoRefresher.prototype.onUpdate = function (mdfile) {
    this.files[this.getHash(mdfile)] = Date.now();
}

/**
 * Route function of endpoint.
 * 
 * @param {*} req request
 * @param {*} res response
 */
AutoRefresher.prototype.route = function (req, res) {
    let hash = req.params.id;

    if (hash in this.files) {
        res.send(String(this.files[hash]));
    } else {
        res.send("0");
    }
}

module.exports = AutoRefresher;