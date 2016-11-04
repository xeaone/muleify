const Fs = require('fs');
const Path = require('path');
const Comment = require('./comment');
const Config = require('../../config');
const Globals = require('../../globals');

module.exports = function (text, paths) {
	var variables = Globals.variables;

	text = handleExportVariables(text, variables);
	text = handleImportPartials(text, paths);
	text = handleImportVariables(text, variables);

	return Promise.resolve(text);
};

function handleExportVariables (text, variables) {
	const commentRegExp = new RegExp(Config.commentRegExpString, 'ig');
	const comments = text.match(commentRegExp) || [];

	if (comments.length === 0) return text;

	comments.forEach(function (comment) {
		comment = new Comment(comment);

		if (comment.count > 1) {

			for (var i = 0; i < comment.count; i++) {
				var value = comment.values[i];
				var key = comment.keys[i];
				if (key !== 'partial' && key !== 'variable' && key !== 'layout') variables.set(key, value);
			}

			text = text.replace(comment.comment, '');

		} else if (comment.key !== 'partial' && comment.key !== 'variable' && comment.key !== 'layout') {
			variables.set(comment.key, comment.value);
			text = text.replace(comment.comment, '');
		}
	});

	return text;
}

function handleImportPartials (text, paths) {
	const partialRegExp = new RegExp(Config.partialRegExpString, 'ig');
	const partialComments = text.match(partialRegExp) || [];

	if (partialComments.length === 0) return text; // stop loop

	partialComments.forEach(function (partialComment) {
		var comment = new Comment(partialComment);
		var path = Path.join(paths.root, comment.value);
		var partial = Fs.readFileSync(path, 'binary');
		text = text.replace(comment.comment, partial);
	});

	return handleImportPartials(text, paths); // loop
}

function handleImportVariables (text, variables) {
	const variableRegExp = new RegExp(Config.variableRegExpString, 'ig');
	const comments = text.match(variableRegExp) || [];

	if (comments.length === 0) return text;

	comments.forEach(function (comment) {
		comment = new Comment(comment);

		var variableValue = variables.get(comment.value);

		if (variableValue) {
			var commentRegExp = new RegExp(comment.comment, 'ig');
			text = text.replace(commentRegExp, variableValue);
		}
	});

	return text;
}
