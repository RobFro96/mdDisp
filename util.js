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

Util.formatToc = function (tocJson) {
    return Util.formatTocLevel({
        "text": "",
        "numbers": "",
        "children": tocJson,
        "link": ""
    });
}

Util.formatTocLevel = function (tocJson) {
    let listElements = "";

    for (let child of tocJson.children) {
        listElements += `
            <li>
                ${Util.formatTocLevel(child)}
            </li>
        `;
    }

    return `
        <a href="#${tocJson.link}">${tocJson.text}</a>
        <ol>
            ${listElements}
        </ol>
    `;
}

Util.formatTime = function (time) {
    if (new Date().toLocaleDateString() == time.toLocaleDateString) {
        return time.toLocaleTimeString();
    } else {
        return time.getDate() + "." + (time.getMonth() + 1) + "." + time.getFullYear();
    }
}

module.exports = Util;