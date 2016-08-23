const Path = require('path');
const When = require('when');
const Fsep = require('fsep');
const CssParser = require('css');

const PARSE_OPTIONS = {
	silent: true
};

const STRINGIFY_OPTIONS = {
	indext: '\t'
};

module.exports = function (text, paths, self) {

	if (!self.isBundle) return When.resolve(text);

	var cssAst = CssParser.parse(text, PARSE_OPTIONS);

	return handleImports(cssAst, paths).then(function (newCssAst) {

		return CssParser.stringify(newCssAst, STRINGIFY_OPTIONS);

	}).catch(function (error) { throw error; });
};

/*
	internal
*/

function handleImports (cssAst, paths, importPathRelativePrevious) {
	var importPathRelative = null;
	var importPathAbsolute = null;

	var importObjects = cssAst.stylesheet.rules.filter(function (rule) { // get imports
		return rule.type === 'import';
	});

	if (importObjects.length === 0) return When.resolve(cssAst); // stop loop

	var importPromises = importObjects.map(function (importObject) {

		// replaces url/quote
		importPathRelative = importObject.import.replace(/'|"|url\(|\)/gi, '');

		if (importPathRelative === paths.relative) throw new Error('CssTransformer: self import ' + importPathRelative);
		if (importPathRelativePrevious === importPathRelative) throw new Error('CssTransformer: circlular import ' + importPathRelative);

		importPathAbsolute = Path.join(paths.directory, importPathRelative);

		return Fsep.valid(importPathAbsolute).then(function (isValid) {
			if (!isValid) throw new Error('CssTransformer: path ' + importPathAbsolute + ' is not valid');
			else return Fsep.readFile(importPathAbsolute, 'utf8');

		}).then(function (text) {
			return {
				index: cssAst.stylesheet.rules.indexOf(importObject),
				ast: CssParser.parse(text, PARSE_OPTIONS)
			};
		}).catch(function (error) {
			throw error;
		});
	});

	return When.all(importPromises).then(function (importItems) {

		importItems.forEach(function (importItem) {
			cssAst.stylesheet.rules.splice(importItem.index, 1, importItem.ast.stylesheet.rules);
			cssAst.stylesheet.rules = [].concat.apply([], cssAst.stylesheet.rules);
		});

		return handleImports(cssAst, paths, importPathRelative); // loop

	}).catch(function (error) { throw error; });
}
