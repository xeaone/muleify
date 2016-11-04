[Star Issue Like Watch](https://github.com/AlexanderElias/muleify)

# Muleify #

Front end generation command line tool.

Static Site Generator / Website Bundler / Asset Compiler / HTML Templating / Web Components


## Overview ##
Muleify is the one stop shop for your web front end needs, it is a command line tool that handles all your website development needs. Muleify has a unique no configuration required interface. It automatically handles many tasks such as compiling scss, less, ES6 to ES5, bundling, and minifing. Muleify uses extensions and sub-extensions to automatically handle these tasks. With almost almost zero configuration or changes to existing projects you can get started. If there is a feature you want let me know or make a PR. Confirmed node versions are 4LTS and 6LTS

Another static asset generator you might say.
- quick and easy
- no learning curve
- zero configuration
- based on extensions/sub-extensions

TODOS
- less
- minify (partially completed)
- other template languages

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
- `muleify encamp <path>` creates a new site's file and folder structure (requires a JSON file)
	- `-d, --domain <url>` domain to be used in the automatically generated sitemap
- `muleify map <path>` generates a sitemap.xml (requires a JSON file)
	- `-d, --domain <url>` domain to be used in the automatically generated sitemap


#### Sub Extensions ####
Sub extensions are period separated files names. They can be combined in any order or combination. The generated file will not contain the sub-extensions. For example a file in the src directory could be named `file.b.e.js` and the dist directory it would be named `file.js`.

##### Options #####
- **ALL**
	- `i` - ignore
- **HTML**
	- `v` - **view** inserted into layout
	- `l` - **layout** wraps all view files
	- `p` - **partial** allows file to be imported
	- `m` - **minify** minify code (under development)
- **JS**
	- `e` - **es** compiles to es5
	- `b` - **bundle** modules (AMD, CJS, UMD, ES) to IIFE
	- `m` - **minify** minify code
- **CSS**
	- `b` - **bundle** all imports
	- `m` - **minify** minify code
- **SCSS**
	- `m` - **minify** minify code

#### Includes/Imports/Partials/Layouts ####
For consistency it is best to start all paths with `./`.

##### HTML #####
Note `partial` relative path from file

- layout a placeholder: `<!-- { "layout": "*" } -->`
- import a partial: `<!-- { "partial": "./root/header.p.html" } -->`
- define a variable: `<!-- { "title": "I Am Title" } -->`
- import a variable: `<!-- { "variable": "title" } -->`

##### JS #####
Note ES6 `import` relative path from file

##### CSS #####
Note `@import` relative path from file

##### SCSS #####
Sass automatically bundles imports.
Note `@import` relative path from file



## License ##
Licensed Under MPL 2.0

Copyright 2016 [Alexander Elias](https://github.com/AlexanderElias/)
