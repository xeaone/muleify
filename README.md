[Star Issue Like Watch](https://github.com/AlexanderElias/muleify)

# Muleify #
**Static Site Generator | Website Bundler | Asset Compiler | HTML Templating | Web Components | Preproccessor**

## Overview ##
Muleify is the one stop shop for your web front end needs, it is a command line tool that handles all your website development needs. Muleify has a unique no configuration required interface. It automatically handles many tasks such as compiling sass, scss, less, css, ES6 to ES5, bundling, and minifing. Muleify uses extensions and sub-extensions to automatically handle these tasks. With almost almost zero configuration or changes to existing projects you can get started. If there is a feature you want let me know or make a PR. Confirmed node versions are 4LTS and 6LTS

Another static asset generator you might say.
- quick and easy
- no learning curve
- zero configuration
- based on extensions/sub-extensions

TODOS
- other template languages

## Getting Started ##

#### Install ####
`npm install muleify -g`


#### CLI ####
- `muleify pack <input> <output>` compiles and bundles from the input folder to the output folder
	- `input` path to a directory to compile and bundle
	- `output` path to a directory to generate the content
- `muleify serve <input> <output>` development server recompiles on save
	- `input` path to a directory to compile and bundle
	- `output` path to a directory to serve the content
- `muleify encamp <input> <output>` generates files and folder based on a json document structure (scaffold).
	- `input` path to a JSON file
	- `output` path to a directory
- `muleify map <input> <output>` generates a XML sitemap
	- `input` path to a directory to generate the sitemap
	- `output` path to a directory to output a sitemap.xml
	- `-d, --domain <domain>` domain to be inserted into the sitemap

#### Preprocessor Types ####
JavaScript, CSS, SCSS, SASS, LESS, HTML, MD

#### Sub Extensions ####
Sub extensions are period separated files names. They can be combined in any order or combination. The generated file will not contain the sub-extensions. For example a file in the src directory could be named `file.b.e.js` and the dist directory it would be named `file.js`.

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
	- `b` - **bundle** modules (AMD, CJS, UMD, ES) to IIFE
	- `e` - **es** compiles to es5
	- `m` - **minify** minify code
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
Note ES6 `import` relative path from file

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
