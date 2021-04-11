# mdDisp
__Markdown-Parser with additional Features and Live Display__

## Installation
- Download Node.JS and NPM: <https://nodejs.org/en/>
- Clone or download GitHub repository: <https://github.com/RobFro96/mdDisp.git>
- Install all dependencies from NPM:
  ```
  npm install
  ```
- Run program once to create config.json file.
  ```
  npm start
  ```

## Configuration

### Global Configuration
- Edit the config.json file generated automatically on first startup.
- `"web_port"`: Port of webinterface, defaults to: localhost:7768
- `"folders"`: All project folders as key-value-pairs, e. g.
  ```json
  "folders": {
    "Test": "/home/robert/markdown/",  // linux
    "Test2": "C:\\Users\\Robert\\Markdown\\" // windows
  },
  ```
  *Make sure to escape backslash in Windows path with `\\`!*
- `"preview_json"`: Filename of created preview template
- `"filebrowser_extensions"`: Filebrowser setting for file extensions, using FontAwesome-Icons for filetypes.
- `"mathjax_macros"`: Macros for MathJax
  *Make sure to escape backslash with `\\`!*

### Folder Configuration
- Add folder to global configuration and ensure program in running.
- The default configuration file in copied into project path, called .mdconfig.json
- `"options"`: Global parser options, see following section
- `"aio-renderer-template"`: All-In-One templated file, located in templates/
- `"aio-renderer-output"`: All-In-One output filename
- `"aio-render-on-change"`: If true, AIO file in generated on every change, if false you need to start AIO creation through export button in webinterface

### Parser Options
- The parser option can either be set globally in folder configuration file, or inside the header of each markdown file
- `"title"`: Title of the file
- `"author"`: Author of the file
- `"styles"`: List of stylesheets, located inside styles/
- `"pagewidth"`: Pagewidth: 0 or ...pt
- `"img_src_text"`: Text for image source
- `"simple-containers"`: List of all possible container types
- `"labels"`: Key-Value-Pair of all label types and their display text.
- `"section_depth"`: Maximum depth of table of contents
- `"chapter"`: Chapter of this file, 0: don't use chapter numbers of <h1> title
- `"autolabel_img"`: automatic labeling of images
- `"autolabel_heading"`: automatic labeling of headings

## Run
- On windows, use mdDisp.bat to start program.
- e. g. create Shortcut and add to start menu or autostart.
- Open browser: localhost:7768

## Example File
- For example file see *test/*
- Add test folder to config file in order to see results.