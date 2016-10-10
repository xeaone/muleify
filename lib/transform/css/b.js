const Path = require('path');
const Promise = require('when');
const Fsep = require('fsep');
const Css = require('css');

const PARSE_OPTIONS = {
	silent: true
};

const STRINGIFY_OPTIONS = {
	indext: '\t'
};

module.exports = function (text, paths) {
	var ast = Css.parse(text, PARSE_OPTIONS);

	return Promise.resolve(ast).then(function (ast) {

		return handleImports(ast, paths);

	}).then(function (ast) {
		return Css.stringify(ast, STRINGIFY_OPTIONS);

	}).catch(function (error) { throw error; });
};

/*
	internal
*/

function handleImports (ast, paths, previousPath) {

	var rules = ast.stylesheet.rules.filter(function (rule) {
		return rule.type === 'import';
	});

	var promises = rules.map(function (rule) {

		// replaces url and quotes
		var cleanPath = rule.import.replace(/'|"|url\(|\)/g, '');
		if (cleanPath === paths.relative) throw new Error('Transform Css B: self import ' + cleanPath);
		if (cleanPath === previousPath) throw new Error('Transform Css B: circlular import ' + cleanPath);

		var path =  Path.join(paths.directory, cleanPath);

		return Fsep.readFile(path, 'binary').then(function (file) {
			return {
				path: path,
				ast: Css.parse(file, PARSE_OPTIONS),
				index: ast.stylesheet.rules.indexOf(rule)
			};
		}).catch(function (error) { throw error; });

	});

	return Promise.all(promises).then(function (importItems) {
		// stop loop
		if (importItems.length === 0) return ast;

		importItems.forEach(function (importItem) {
			ast.stylesheet.rules.splice(importItem.index, 1, importItem.ast.stylesheet.rules);
			ast.stylesheet.rules = [].concat.apply([], ast.stylesheet.rules);
		});

		// start loop
		return handleImports(ast, paths, paths.relative);

	}).catch(function (error) { throw error; });

}
