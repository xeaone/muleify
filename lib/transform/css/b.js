const Path = require('path');
const Fsep = require('fsep');
const Css = require('css');

const URL_REGEXP = /'|"|url\(|\)/g;

const PARSE_OPTIONS = {
	silent: true
};

const STRINGIFY_OPTIONS = {
	indext: '\t'
};

function handleImports (ast, input, previousPath) {

	var rules = ast.stylesheet.rules.filter(function (rule) {
		return rule.type === 'import';
	});

	var promises = rules.map(function (rule) {

		// replaces url and quotes
		var cleanPath = rule.import.replace(URL_REGEXP, '');
		if (cleanPath === input.relative) throw new Error('Transform Css B: self import ' + cleanPath);
		if (cleanPath === previousPath) throw new Error('Transform Css B: circlular import ' + cleanPath);

		var path =  Path.join(input.directory, cleanPath);

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
		return handleImports(ast, input, input.relative);

	}).catch(function (error) {
		throw error;
	});

}


module.exports = function (text, input, output, result) {
	text = result || text;

	const ast = Css.parse(text, PARSE_OPTIONS);

	return Promise.resolve(ast).then(function (ast) {
		return handleImports(ast, input);
	}).then(function (ast) {
		return Css.stringify(ast, STRINGIFY_OPTIONS);
	}).catch(function (error) {
		throw error;
	});
};
