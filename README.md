# Muleify #

Front end generation tool.

Static Site Generator / Website bundler / Asset Compiler / HTML Templating


## Overview ##
Muleify is the one stop shop for your front end needs, it is a command line tool that does or will handle all your website development needs. Muleify has a unique no configuration needed interface. It automatically handles many tasks such as compiling scss, less, ES6 to ES5, and bundling. Muleify uses extensions sub-extensions to automatically handle these tasks. With almost almost zero configuration or changes to existing projects you can get started. If there is a feature you want let me know or make a PR.

Another static asset generator you might say.
- zero configuration
- based on extensions/sub-extensions
- easy to use
- no learning curve

TODOs
- less
- minify
- more template languages

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
- **JS**
	- `e` - **es6** compiles to es5
	- `b` - **bundle** modules (AMD, CJS, ES, UMD) to ES (or IIFE if used in conjunction with the `e` sub-extensions)
- **CSS**
	- `b` - **bundle** all imports

#### Includes/Imports/Partials/Layouts ####

##### HTML #####
Note `partial` paths need to start at `src` root.

- layout a placeholder: `<!-- { "layout": "*" } -->`
- import a partial: `<!-- { "partial": "root/header.p.html" } -->` (TODO fix this to relative)
- define a variable: `<!-- { "title": "I Am Title" } -->`
- import a variable: `<!-- { "variable": "title" } -->`

##### SCSS #####
Note `@import` paths need to start at `src` root.

##### CSS #####
Note `@import` relative path from file

##### JS #####
Note ES6 `import` relative path from file


## License ##
Licensed Under MPL 2.0

Copyright 2016 [Alexander Elias](https://github.com/AlexanderElias/)
