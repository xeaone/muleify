# Muleify #
Coming Soon!

Front end generation tool.

Static site generator / Website bundler


## Overview ##
The `pack` command automatically handles many reptative tasks such as compiling scss, less, ES6 to ES5, and bundling. Typically it is best practice to serve one css and js file. If an index.js or index


##### Structure #####
- src
	- pages
	- partials


##### Pages Directory #####
The pages directory will flatten to just its contents. It can contain html files and folder. The contents of pages will preserve it's inner directory structure. The use of `partials`, `variables` and variable declaration is allowed.


##### Partials Directory #####
The partials directory and contents will not exist after generation. Partials are for use with in the contents of pages.


## Usage ##

## Reserved Key Words ##
- variable
- partial

```html
 <!-- { "partial": 'header.html'} -->
<!-- { "title": "hello world" } -->
<!-- { "variable": "title" } -->
```
