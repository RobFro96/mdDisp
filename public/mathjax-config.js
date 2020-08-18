/**
 * mdDisp - Markdown Parser and Viewer
 * @author Robert Fromm
 * @data 14.08.2020
 * 
 * Client Side Javascript:
 * Config of MathJax - Display of LaTeX math code.
 */

window.MathJax = {
    "jax": ["input/TeX", "output/HTML-CSS"],
    "extensions": ["tex2jax.js"],
    "messageStyle": "none",
    "displayAlign": "left",
    "tex2jax": {
        "processEnvironments": false,
        "processEscapes": true,
        "inlineMath": [["$", "$"], ["\\(", "\\)"]],
        "displayMath": [["$$", "$$"], ["\\[", "\\]"]]
    },
    "TeX": {
        "extensions": [
            "AMSmath.js",
            "AMSsymbols.js",
            "noErrors.js",
            "noUndefined.js"
        ]
    },
    "HTML-CSS": {
        "availableFonts": ["TeX"],
        showMathMenu: false
    }
}