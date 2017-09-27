const Globals = require('../../globals');
const Comment = require('./comment');
const Path = require('path');
const PromiseTool = require('promise-tool');
const Fs = PromiseTool.lift(require('fs'));

const SRC = Globals.input;
const COMMENT_REGEXP = Globals.commentRegExp;
const PARTIAL_REGEXP = Globals.partialRegExp;
const VARIABLE_REGEXP = Globals.variableRegExp;

function handleExportVariables (text, variables) {
	return Promise.resolve().then(function () {
		const comments = text.match(COMMENT_REGEXP) || [];

		if (comments.length !== 0) {
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
	});
}

function handleImportVariables (text, variables) {
	return Promise.resolve().then(function () {
		const comments = text.match(VARIABLE_REGEXP) || [];

		if (comments.length !== 0) {
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
	});
}

function handleImportPartials (text, directory) {
	const partialComments = text.match(PARTIAL_REGEXP) || [];

	if (partialComments.length !== 0) {
		var path, comment;
		return PromiseTool.series(partialComments.map(function (partialComment) {
			return function () {
				comment = new Comment(partialComment);
				path = Path.isAbsolute(comment.value) ? comment.value : Path.join(directory, comment.value);
				path = Fs.existsSync(path) ? path : Path.join(SRC, comment.value);
				return Promise.resolve().then(function () {
					return Fs.readFile(path, 'binary');
				}).then(function (partial) {
					return handleImportPartials(partial, path.replace(Path.basename(path), ''));
				}).then(function (partial) {
					return text = text.replace(comment.comment, partial);
				}).catch(function (error) {
					throw error;
				});
			}
		}));
	} else {
		return Promise.resolve(text);
	}
}

module.exports = function (text, input, output, result) {
	var vairables = new Map();
	return Promise.resolve(result || text).then(function (t) {
		return handleExportVariables(t, vairables);
	}).then(function (t) {
		return handleImportPartials(t, input.directory);
	}).then(function (t) {
		return handleImportVariables(t, vairables);
	}).then(function (t) {
		return t;
	}).catch(function (error) {
		throw error;
	});
};
