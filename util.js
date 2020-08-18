/**
 * mdDisp - Markdown Parser and Viewer
 * @author Robert Fromm
 * @data 14.08.2020
 * 
 * Server Side Javascript:
 * Utility function to be used in this program.
 */

Util = {};

/**
 * Converting and parsing relaxed json without colons around the key names.
 * Code from: https://stackoverflow.com/questions/9637517/parsing-relaxed-json-without-eval
 * 
 * @param {string} string bad formatted json
 */
Util.fixJson = function (string) {
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

/**
 * Converting structured table of contents to a nested ordered list.
 * Calling the function formatTocLevel recursively.
 * 
 * @param {dict} tocJson Toc created by LabelRenderer.
 */
Util.formatToc = function (tocJson) {
    return Util.formatTocLevel({
        "text": "",
        "numbers": "",
        "children": tocJson,
        "link": ""
    });
}

/**
 * Helper Function. Please call formatToc instead.
 * @param {dict} tocJson Toc created by LabelRenderer
 */
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

/**
 * Javascript has no formatter for dates. This function returns the date in the Format T.M.Y.
 * 
 * @param {Date} time time to be formatted
 */
Util.formatTime = function (time) {
    if (new Date().toLocaleDateString() == time.toLocaleDateString) {
        return time.toLocaleTimeString();
    } else {
        return time.getDate() + "." + (time.getMonth() + 1) + "." + time.getFullYear();
    }
}

module.exports = Util;