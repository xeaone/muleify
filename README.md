# Muleify #

Front end generation tool.

Static Site Generator / Website bundler / Asset Compiler


## Overview ##
The `pack` command automatically handles many tasks such as compiling scss, less, ES6 to ES5, and bundling. Muleify uses file names and extensions to automatically handle tasks such as compiling/transpiling and bundling.


#### Todo ####
- less
- minify
- html template languages
- more


#### Directory Structure ####
- src: **required**
- dist: **generated** (issue is required for now)


#### Special File Extensions ####

##### JS #####
- `file.es6.js` **ES6** compiles to ES5


##### HTML #####
- `file.l.html` **layout** extension imports all view files
- `file.p.html` **partial** extension allows file to be imported
- `file.v.html` **view** extension inserted into layout


#### Special File Names ####
- `bundle.css` bundles imports
- `bundle.scss` bundles imports
- `bundle.js` bundles modules (AMD, CJS, ES, UMD) to ES
- `bundle.es6.js` bundles modules (AMD, CJS, ES, UMD) to IIFE


#### HTML Files ####
Note `partial` paths need to start at the `src` root.

- layout a placeholder: `<!-- { "layout": "*" } -->`
- import a partial: `<!-- { "partial": "root/header.p.html" } -->`
- define a variable: `<!-- { "title": "I Am Title" } -->`
- import a variable: `<!-- { "variable": "title" } -->`

#### CSS Files ####
Note `@import` paths need to be relative from the importing file.

#### SCSS Files ####
Note `@import` paths need to start at the `src` root.

#### JS Files ####
Note ES6 `import` paths need to be relative from the importing file.
