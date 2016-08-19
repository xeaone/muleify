const When = require('when');
const Comment = require('./comment');
const Config = require('../config');

exports.transform = function (text, options) {

	text = handleImportPartials(text, options);
	text = handleExportVariables(text, options);
	text = handleImportVariables(text, options);

	return When.resolve(text);
};

function handleImportPartials (text, options) {
	const partialRegExp = new RegExp(Config.partialRegExpString, 'ig');
	const partialComments = text.match(partialRegExp) || [];

	if (partialComments.length === 0) return text; // stop loop

	partialComments.forEach(function (partialComment) {
		var pco = new Comment(partialComment);
		var partial = options.partials.get(pco.value);
		text = text.replace(pco.comment, partial.text);
	});

	return handleImportPartials(text, options); // loop
}

function handleExportVariables (text, options) {
	const commentRegExp = new RegExp(Config.commentRegExpString, 'ig');
	const comments = text.match(commentRegExp) || [];

	if (comments.length === 0) return text;

	comments.forEach(function (comment) {
		comment = new Comment(comment);

		if (comment.key !== 'partial' && comment.key !== 'variable' && comment.key !== 'layout'
		&& comment.key !== 'par' && comment.key !== 'var'&& comment.key !== 'lay') {
			options.variables.set(comment.key, comment.value);
			var variableCommentRegExp = new RegExp(comment.comment, 'ig');
			text = text.replace(variableCommentRegExp, '');
		}
	});

	return text;
}

function handleImportVariables (text, options) {

	const variableRegExp = new RegExp(Config.variableRegExpString, 'ig');
	const variableComments = text.match(variableRegExp) || [];

	if (variableComments.length === 0) return text;

	variableComments.forEach(function (variableComment) {
		variableComment = new Comment(variableComment);

		var variableValue = options.variables.get(variableComment.value);
		var commentRegExp = new RegExp(variableComment.comment, 'ig');
		text = text.replace(commentRegExp, variableValue);
	});

	return text;
}
