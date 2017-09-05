[Star Issue Like Watch](https://github.com/AlexanderElias/muleify)

# Muleify
**Static Site Generator | Website Bundler | Asset Compiler | Templating | Preprocessor**

[![Build Status](https://travis-ci.org/AlexanderElias/muleify.svg?branch=master)](https://travis-ci.org/AlexanderElias/muleify)

## Overview
Muleify is the one stop shop for your web front end needs, it is a command line tool that handles all your website development needs. Muleify has a unique no configuration required interface. It automatically handles many tasks such as compiling Sass, Scss, Less, Css, ES6 to ES5, bundling, and minifying. Muleify uses extensions and sub-extensions to automatically handle these tasks. With almost almost zero configuration or changes to existing projects you can get started. If there is a feature you want let me know or make a PR. Confirmed node versions are 4, 6, 8.

## Features
Another static site and asset generator you might say.
- zero configuration
- quick and easy
- no learning curve
- based on extensions and sub-extensions
- imports, includes, partials, and layouts
- serves single page applications (spa's)

## Changes
- 2.7.0 removes default sass/scss support. After install if you want to use sass run `muleify install-node-sass`.

## Issues
The node-sass package tends to have issues. If you experience this let me know. Or try out Less, because its More.

## Getting Started ##

#### Install ####
`npm install muleify -g`


#### Update ####
`npm uninstall muleify -g && npm install muleify -g`



#### CLI ####
- `muleify pack [options] <input> <output>` Packs folder/file and muleifies
	- `input` path to folder or file
	- `output` path to folder or file
	- `-e, --es` Transpile to ES5
	- `-w, --watch` Watches the input (if file it will watch the folder)
	- `-m, --minify` Minifies the output

- `muleify serve [options] <input> [output]` Serves a folder and muleifies
	- `input` path to folder
	- `output` path to folder
	- `-e, --es` Transpile to ES5
	- `-w, --watch` Watches the input
	- `-m, --minify` Minifies the output
	- `-c, --cors` Enables cross origin resource sharing mode
	- `-s, --spa` Enables sigle page application mode (files/folders that do not exist will server the root index.html)

- `muleify map [options] <input> <output>` Creates XML sitemap
	- `input` path to a folder to generate the sitemap
	- `output` path to a folder to output sitemap.xml
	- `-d, --domain <domain>` Inserts domain into sitemap

- `muleify encamp [options] <input.json> <output>` Creates folders and files
	- `input` path to a JSON file
	- `output` path to a folder


#### Preprocessor Types ####
JavaScript, CSS, SCSS, SASS, LESS, HTML, MD

#### Sub Extensions ####
Sub extensions are period separated files names. They can be combined in any order or combination. The generated file will not contain the sub-extensions. For example a file in the src folder could be named `file.b.e.js` and the dist folder it would be named `file.js`.

##### Options #####
- **ALL**
	- `i` - ignore

- **HTML**
	- `l` - **layout** wraps all view files
	- `v` - **view** inserted into layout
	- `p` - **partial** allows file to be imported
	- `m` - **minify** minify code (under development)

- **MD**

- **JS**
	- `b` - **bundle** modules ESM to UMD
	- `e` - **es** transpile to ES5
	- `m` - **minify** minify code
		- `@preserve` will persist comments.
		- `@banner` will place comment at document start.

- **CSS**
	- `b` - **bundle** all imports
	- `m` - **minify** minify code

- **SCSS**
	- `m` - **minify** minify code

- **LESS**
	- `m` - **minify** minify code


#### Includes/Imports/Partials/Layouts ####
For consistency it is best to start all paths with `./`.

##### HTML #####
Note `partial` relative path from file

- layout a placeholder: `<!-- { "layout": "*" } -->`
- import a partial: `<!-- { "partial": "./header.p.html" } -->`
- define a variable: `<!-- { "title": "I Am Title" } -->`
- import a variable: `<!-- { "variable": "title" } -->`

##### MD #####
Converts to HTML.

##### JS #####
Supports ESM `import` relative path from file and also the node resolution algorithm. For node resolution it will search the `node_modules` package.js files for `"module": "file"` or `main: "file"`.

##### CSS #####
Note `@import` relative path from file

##### SCSS #####
Sass automatically bundles imports.
Note `@import` relative path from file

##### LESS #####
Less automatically bundles imports.
Note `@import` relative path from file


## License ##
Licensed Under MPL 2.0

Copyright 2016 [Alexander Elias](https://github.com/AlexanderElias/)
