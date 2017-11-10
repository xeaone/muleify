'use strict';

const Path = require('path');
const Fsep = require('fsep');

const URL = /.*?(?:'|")(.*?)(?:'|").*?;/;
const IMPS = /@import.*?;/g;

module.exports = async function CssBundle (text, input, output) {
	var imps = text.match(IMPS) || [];
	
	if (!imps.length) return text;

	var imp = imps[0];
	var path = Path.join(input.directory, imp.replace(URL, '$1'));

	if (path === input.absolute) {
		throw new Error(`circlular import ${path}`);
	}

	const data = await Fsep.readFile(path, 'utf8');
	text = text.replace(imp, data);

	return await CssBundle(text, input);
};
