!mdDisp: title:"Test Document", author: "Robert Fromm", pagewidth: "600pt"

## mdDisp Header
- The first line of the document must contain the mdDisp header.
- Starting with `!mdDisp:` and followed by a simplified JSON Object
- Simplified JSON Objects are used multiple times: no quotations marks are used key names.
- See all options in Readme.md or templates/default-options.json

## Headings and Table of Content
- Always start with second order headings `## ...`
- The table of content is automatically generated.
- Use option `"section_depth"` to define maximum depth

### Subsection 1
#### Subsubsection 1
#### Subsubsection 2
### Subsection 2

## Default Markdown

For default text and list examples see: <https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet>

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

- New lines are generated
  automatically!
- Inline Formatting:
  - `*italic*`: *italic*
  - `__bold__`: __bold__
  - `code` with graves
  - __Newly Added!__
    - `~sub~`: Hallo~sub~
    - `^sup^`: Hallo^sup^
    - `_underlined_`: _underlined_
- Use `< ... >` for HTTP-Links: <http://robert-fromm.info/>
  - Nested lists are easy!
  - Jipppy!
- And ordered lists:
  1. Apples
  2. Oranges
  3. Peaches

## Lables and References *!sec:labels*

- Lables are References are implemented like in LaTeX.
- Define a label with e. g. `*!sec:labels*`
- Define a reference with e. g. `*?sec:labels*`, *?sec:labels*
- Use only label prefixes defined in the labels option.
- E. g.
  - *fig*: Figure
  - *sec*: Section
  - *lst*: Listing
  - *task*: Task
  - *eq*: Equation
  - *tab*: Table

## Listings

*!lst:_* A Javascript Listing
```js
var Main = function () {
  this.path = "";
  let myargs = process.argv.slice(2);
  if (myargs.length >= 1) {
      this.path = myargs[0];
  }

  this.enableWatcher();
}
```

- Highlight.JS is used for formatting.
- See <https://highlightjs.org/static/demo/>, for supported languages and styles

## Math
- Math is implemented with the help of MathJax
- Use single dollar for inline math: $x = 5$
- Add double dollar for full-line math:
  $$ \sum_{i=1}^n = \frac{n(n+1)}{2} $$

- Add macros to global configuration, if needed.
- Demo of the implemented macros:

$$ I\ped{diode} = 12\si{mA},\quad \frac{\d}{\d x}\, \sin x = \cos x,\quad \e^{\j\pi} = -1 $$

```latex
$$ I\ped{diode} = 12\si{mA},\quad \frac{\d}{\d x}\, \sin x = \cos x,\quad \e^{\j\pi} = -1 $$
```


## Figures
- The typical markdown figure code `![alt-text](source)`
- The alt-text is replaced with a simplified JSON object.
- Possible values:
  - `alt`: Alt-text and description
  - `src`: Source of image
  - `w`:
    - Number: Width in percent
    - String: CSS value of `max-width`
  - `x`: Scaling factor, very useful for SVG images
  - `half`: Needs to be set, when multiple images are placed next to each other
  - `label`: Label for later referencing, e. g. *?fig:testpicture*

![alt: "Lena Test Picture", src: "Wikipedia", w:50, half: 1](https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png) ![alt: "Lena Test Picture", src: "Wikipedia", w:50, half: 1](https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png)


![alt: "Testbild", src: "Wikipedia", x:0.5, label:"fig:testpicture"](https://upload.wikimedia.org/wikipedia/commons/1/1c/FuBK_testcard_vectorized.svg)

## Container
- The following container are defined in the default file options and can be used to wrap a part of the markdown file inside a `<div>` tag.
- Formatting is added through the CSS file.
- task, example, overview, solution, no-print

:::task
*!task* Example Task
:::

::: example
An Example.
:::

::: overview
An Overview
:::

::: solution
An Solution, maybe hidden by adding a CSS property!
:::

:::no-print
no-print: May not appear if HTML page is printed.
:::

- Additionally spoilers can be added with the following construct:

:::spoiler A Spoiler
Here you can find a very secret information!
:::