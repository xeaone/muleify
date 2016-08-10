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

// TODO: need to handle circlular references
// TODO: dont allow import of self
// TODO: import url

exports.transform = function (text, options) {

	var cssAst = CssParser.parse(text, PARSE_OPTIONS);

	return handleImports(cssAst, options.dir).then(function (newCssAst) {

		var cssStr = CssParser.stringify(newCssAst, STRINGIFY_OPTIONS);

		return cssStr;

	}).catch(function (error) { throw error; });
};

/*
	internal
*/

function handleImports (cssAst, dir) {

	// get imports
	var importObjects = cssAst.stylesheet.rules.filter(function (rule) {
		return rule.type === 'import';
	});

	var importPromises = importObjects.map(function (importObject) {
		var importPath = null;

		// replace url or quote
		importPath = importObject.import.replace(/'|"|url\(|\)/gi, '');
		importPath = Path.join(dir, importPath);

		return Fsep.valid(importPath).then(function (isValid) {

			if (!isValid) throw new Error('css path ' + importPath + ' is not valid');
			else return Fsep.readFile(importPath, 'utf8');

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

		return cssAst;

	}).catch(function (error) { throw error; });
}
