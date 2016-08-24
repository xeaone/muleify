# Muleify #

Front end generation tool.

Static Site Generator / Website bundler / Asset Compiler


## Overview ##
The `pack` command automatically handles many tasks such as compiling scss, less, ES6 to ES5, and bundling. Muleify uses file names and extensions to automatically handle tasks such as compiling/transpiling and bundling. Muleify has zero to no configuration necessary there is no need for third party plugins as everything is and will be native and optimized if there is a feature you want let me know or make a PR.

Another static asset generator you might say.
- zero configuration
- based on extensions
- easy to use
- almost no learning curve


## Install ##
`npm install muleify -g`


## CLI ##
- `muleify pack .` compiles and bundles src to dist
- `muleify serve .` development server recompiles on save


#### Todo ####
- less
- minify
- html template languages
- more


#### Directory Structure ####
- src: **required**
- dist: **required**


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
- import a partial: `<!-- { "partial": "root/header.p.html" } -->` (TODO fix this to relative)
- define a variable: `<!-- { "title": "I Am Title" } -->`
- import a variable: `<!-- { "variable": "title" } -->`

#### CSS Files ####
Note `@import` paths need to be relative from the importing file.

#### SCSS Files ####
Note `@import` paths need to start at the `src` root. (TODO fix this to relative)

#### JS Files ####
Note ES6 `import` paths need to be relative from the importing file.


## License ##
Licensed Under MPL 2.0

Copyright 2016 [Alexander Elias](https://github.com/AlexanderElias/)
