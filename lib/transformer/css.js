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

// TODO: import url

exports.transform = function (text, options) {

	var cssAst = CssParser.parse(text, PARSE_OPTIONS);

	return handleImports(cssAst, options).then(function (newCssAst) {

		var cssStr = CssParser.stringify(newCssAst, STRINGIFY_OPTIONS);

		return cssStr;

	}).catch(function (error) { throw error; });
};

/*
	internal
*/

function handleImports (cssAst, options, importPathBaseFullPrevious) {
	var importPathBaseFull = null;
	var importPathAbsolute = null;

	var importObjects = cssAst.stylesheet.rules.filter(function (rule) { // get imports
		return rule.type === 'import';
	});

	if (importObjects.length === 0) return When.resolve(cssAst); // stop loop

	var importPromises = importObjects.map(function (importObject) {

		importPathBaseFull = importObject.import.replace(/'|"|url\(|\)/gi, ''); // replace url/quote

		if (importPathBaseFull === options.baseFull) throw new Error('CssTransformer: self import ' + importPathBaseFull);
		if (importPathBaseFullPrevious === importPathBaseFull) throw new Error('CssTransformer: circlular import ' + importPathBaseFull);

		importPathAbsolute = Path.join(options.directory, importPathBaseFull);

		return Fsep.valid(importPathAbsolute).then(function (isValid) {

			if (!isValid) throw new Error('css path ' + importPathAbsolute + ' is not valid');
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

		return handleImports(cssAst, options, importPathBaseFull); // loop all imports

	}).catch(function (error) { throw error; });
}
