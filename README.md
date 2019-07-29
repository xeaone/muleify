[Star Issue Watch](https://github.com/AlexanderElias/muleify)

# Muleify
**Static Site Generator | Website Bundler | Asset Compiler | Templating | Preprocessor**

[![Build Status](https://travis-ci.org/AlexanderElias/muleify.svg?branch=master)](https://travis-ci.org/AlexanderElias/muleify)

### Overview
Muleify is the one stop shop for your web front end needs, it is a command line tool that handles all your website development needs. Muleify has a unique no configuration required interface. It automatically handles many tasks such as compiling Sass, Scss, Less, Css, ES6 to ES5, bundling, and minifying. Muleify uses extensions and sub-extensions to automatically handle these tasks. With almost almost zero configuration or changes to existing projects you can get started. If there is a feature you want let me know or make a PR.

### Features
Another static site and asset generator you might say.
- zero configuration
- quick and easy
- no learning curve
- based on extensions and sub-extensions
- single page applications support (spa's)
- imports, includes, partials, templates, and layouts
- preprocessor types JavaScript, CSS, SCSS, SASS, LESS, HTML, MD

### Install
`npm i -g muleify`

### Changes
- 3.x.x uses async/awiat so node version >=7.6.0
- 2.7.0 removes default sass/scss support. After install if you want to use sass run `muleify install-node-sass`.

## CLI
- `muleify -p [options] <input> <output>` Packs a folder or file
	- `input` path to folder or file
	- `output` path to folder or file
	- `-b, --bundle` Bundles the output
	- `-m, --minify` Minifies the output
	- `-t, --transpile` Transpile the output
	- `-w, --watch` Watches a file or folder
	- `-p, --path <path>` Defines the path to watch
	- `-s, --serve` Serves a folder or file

- `muleify -s [options] <input> [output]` Serves a folder or file
	- `input` path to folder
	- `output` path to folder (optional)
	- `-s, --spa` Enables single page application mode
	- `-c, --cors` Enables cross origin resource sharing mode

- `muleify -m [options] <input> <output>` Creates XML sitemap
	- `input` path to a folder to generate the sitemap
	- `output` path to a folder to output sitemap.xml
	- `-d, --domain <domain>` Inserts domain into sitemap

- `muleify -e [options] <input> <output>` Creates folders and files from a json file
	- `input` path to a JSON file
	- `output` path to a folder

- `muleify -i` Installs sass/scss compiler (might require sudo)

## Extensions
Muleify uses extensions and sub-extensions to process specail file types. Sub-extensions are period separated names. They can be combined in any order or combination. The generated file will not contain the sub-extensions. For example a file in the src folder could be named `file.b.e.js` and the dist folder it would be named `file.js`.

### Options

#### ALL
- `i` - ignore

#### HTML
- `l` - **layout** wraps all view files
- `v` - **view** inserted into layout
- `p` - **partial** allows file to be imported
- `m` - **minify** minify code (under development)

#### MD

#### JS
- `b` - **bundle** modules ESM to UMD
- `t` - **transpile**
	- async/await to promises
	- transpile to [browser list defaults](http://browserl.ist/?q=defaults)
- `m` - **minify** minify code
	- `@preserve` will persist comments.
	- `@banner` will place comment at document start.

#### CSS
- `b` - **bundle** all imports
- `t` - **transpile**
	- transpile to [browser list defaults](http://browserl.ist/?q=defaults)
- `m` - **minify** minify code

#### SCSS
- `m` - **minify** minify code

#### LESS
- `m` - **minify** minify code

## Includes/Imports/Partials/Layouts
The path includes/imports/partials/layouts are relative from the input folder.

### Options

#### HTML
Note `partial` relative path from file
- layout a placeholder: `<!-- { "layout": "*" } -->`
- import a partial: `<!-- { "partial": "./header.p.html" } -->`
- define a variable: `<!-- { "title": "I Am Title" } -->`
- import a variable: `<!-- { "variable": "title" } -->`

#### MD
Converts to HTML.

#### JS
Supports ESM `import` relative path from file and also the node resolution algorithm. For node resolution it will search the `node_modules` package.js files for `"module": "file"` or `main: "file"`.

#### CSS
Note `@import` relative path from file

#### SCSS
Sass automatically bundles imports.
Note `@import` relative path from file

#### LESS
Less automatically bundles imports.
Note `@import` relative path from file

## Authors
[AlexanderElias](https://github.com/AlexanderElias)

## License
[Why You Should Choose MPL-2.0](http://veldstra.org/2016/12/09/you-should-choose-mpl2-for-your-opensource-project.html)
This project is licensed under the MPL-2.0 License
