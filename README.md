# Muleify #
Coming Soon!

Front end generation tool.

Static site generator / Website bundler


## Overview ##
The `pack` command automatically handles many tasks such as compiling scss, less, ES6 to ES5, and bundling. Muleify uses file names and extensions to automatically handle tasks such as compiling/transpiling and bundling.


Typically it is best practice to serve one css and js file. If an index.js or index.scss


#### Directory Structure ####
- src: **required**
- dist: **generated** (issue is required for now)


#### File Extensions ####
- file.phtml

#### Bundle Names ####
- bundle.js
- bundle.css
- bundle.scss


#### Html Files ####
- import a partial: `<!-- { "partial": "./header.phtml" } -->`

- define a variable: `<!-- { "title": "I Am Title" } -->`

- import a variable: `<!-- { "variable": "title" } -->`
