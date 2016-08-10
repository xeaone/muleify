const When = require('when');
const Comment = require('../comment');
const Config = require('../config');

exports.transform = function (text, options) {

	text = importPartials(text, options);
	text = exportVariables(text, options);
	text = importVariables(text, options);

	return When.resolve(text);
};

function importPartials (text, options) {
	const partialRegExp = new RegExp(Config.partialRegExpString, 'ig');
	const partialComments = text.match(partialRegExp) || [];

	if (partialComments.length === 0) return text;

	partialComments.forEach(function (partialComment) {
		var pco = Comment(partialComment);
		var partial = options.partials.get(pco.value);
		text = text.replace(pco.comment, partial.text);
	});

	return importPartials(text, options); // loop
}

function exportVariables (text, options) {
	const commentRegExp = new RegExp(Config.commentRegExpString, 'ig');
	const comments = text.match(commentRegExp) || [];

	if (comments.length === 0) return null;

	comments.forEach(function (comment) {
		comment = Comment(comment);

		if (comment.key !== 'partial' && comment.key !== 'variable' && comment.key !== 'par' && comment.key !== 'var') {
			options.variables.set(comment.key, comment.value);
			var variableCommentRegExp = new RegExp(comment.comment, 'ig');
			text = text.replace(variableCommentRegExp, '');
		}
	});

	return text;
}

function importVariables (text, options) {
	const variableRegExp = new RegExp(Config.variableRegExpString, 'ig');
	const variableComments = text.match(variableRegExp) || [];

	if (variableComments.length === 0) return null;

	variableComments.forEach(function (variableComment) {
		variableComment = Comment(variableComment);

		var variableValue = options.variables.get(variableComment.value);
		var commentRegExp = new RegExp(variableComment.comment, 'ig');
		text = text.replace(commentRegExp, variableValue);
	});

	return text;
}
