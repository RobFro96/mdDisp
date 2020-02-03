Util = {};

Util.fixJson = function (string) {
    // von https://stackoverflow.com/questions/9637517/parsing-relaxed-json-without-eval

    try {
        let crappyJSON = "{" + string + "}";
        let fixedJSON = crappyJSON// Replace ":" with "@colon@" if it's between double-quotes
            .replace(/:\s*"([^"]*)"/g, function (match, p1) {
                return ': "' + p1.replace(/:/g, '@colon@') + '"';
            })

            // Replace ":" with "@colon@" if it's between single-quotes
            .replace(/:\s*'([^']*)'/g, function (match, p1) {
                return ': "' + p1.replace(/:/g, '@colon@') + '"';
            })

            // Add double-quotes around any tokens before the remaining ":"
            .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')

            // Turn "@colon@" back into ":"
            .replace(/@colon@/g, ':')
        return JSON.parse(fixedJSON);
    } catch (e) {
        return null;
    }
}

module.exports = Util;