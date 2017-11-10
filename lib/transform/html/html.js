'use strict';

const Global = require('../../global');
const Comment = require('./comment');

const Path = require('path');
const Fsep = require('fsep');

const SRC = Global.input;
const COMMENT_REGEXP = Global.commentRegExp;
const PARTIAL_REGEXP = Global.partialRegExp;
const VARIABLE_REGEXP = Global.variableRegExp;

async function handleExportVariables (text, variables) {
	const comments = text.match(COMMENT_REGEXP) || [];

	if (comments.length) {
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
	}

	return text;
}

async function handleImportVariables (text, variables) {
	const comments = text.match(VARIABLE_REGEXP) || [];

	if (comments.length) {
		comments.forEach(function (comment) {
			comment = new Comment(comment);
			var variableValue = variables.get(comment.value);
			if (variableValue) {
				var commentRegExp = new RegExp(comment.comment, 'ig');
				text = text.replace(commentRegExp, variableValue);
			}
		});
	}

	return text;
}

async function handleImportPartials (text, directory) {
	const partialComments = text.match(PARTIAL_REGEXP) || [];

	if (!partialComments.length) return text;

	var path, comment, partial;

	for (var i = 0, l = partialComments.length; i < l; i++) {
		var partialComment = partialComments[i];

		comment = new Comment(partialComment);

		path = Path.isAbsolute(comment.value) ? comment.value : Path.join(directory, comment.value);
		path = Fsep.existsSync(path) ? path : Path.join(SRC, comment.value);

		partial = await Fsep.readFile(path, 'binary');
		partial = await handleImportPartials(partial, path.replace(Path.basename(path), ''));

		text = text.replace(comment.comment, partial);
	}

	return text;
}

module.exports = async function (text, input, output) {
	var vairables = new Map();

	text = await handleExportVariables(text, vairables);
	text = await handleImportPartials(text, input.directory);
	text = await handleImportVariables(text, vairables);

	return text;
};
