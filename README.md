# Muleify #

Front end generation tool.

Static Site Generator / Website bundler / Asset Compiler / HTML Templating


## Overview ##
The `pack` command automatically handles many tasks such as compiling scss, less, ES6 to ES5, and bundling all of these are optional. Muleify uses file names and extensions to automatically handle tasks such as compiling/transpiling and bundling. Muleify has almost zero configuration. If there is a feature you want let me know or make a PR.

Another static asset generator you might say.
- zero configuration
- based on extensions
- easy to use
- almost no learning curve

TODOs
- less
- minify
- html template languages
- more

## Getting Started ##

#### Install ####
`npm install muleify -g`


#### CLI ####
- `muleify pack` compiles and bundles src to an output directory
	- `-p, --path <path>` path to working directory
	- `-o, --o <output>` output directory name (defaults to "dist")
- `muleify serve` development server recompiles on save
	- `-p, --path <path>` path to working directory
	- `-o, --o <output>` output directory name (defaults to "dist")


#### Requirements ####
- src: **required**


#### Sub Extensions ####

##### HTML #####
- `file.l.html` **layout** extension imports all view files
- `file.p.html` **partial** extension allows file to be imported
- `file.v.html` **view** extension inserted into layout

##### JS #####
- `file.es6.js` **ES6** compiles to ES5


#### Special File Names ####
- `bundle.css` bundles imports
- `bundle.scss` bundles imports
- `bundle.js` bundles modules (AMD, CJS, ES, UMD) to ES
- `bundle.es6.js` bundles modules (AMD, CJS, ES, UMD) to IIFE

#### Includes/Imports/Partials/Layouts ####

##### HTML #####
Note `partial` paths need to start at `src` root.

- layout a placeholder: `<!-- { "layout": "*" } -->`
- import a partial: `<!-- { "partial": "root/header.p.html" } -->` (TODO fix this to relative)
- define a variable: `<!-- { "title": "I Am Title" } -->`
- import a variable: `<!-- { "variable": "title" } -->`

##### SCSS #####
Note `@import` paths need to start at `src` root. (TODO fix this to relative)

##### CSS #####
Note `@import` relative path from file

##### JS #####
Note ES6 `import` relative path from file


## License ##
Licensed Under MPL 2.0

Copyright 2016 [Alexander Elias](https://github.com/AlexanderElias/)
