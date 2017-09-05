const Path = require('path');
const Fs = require('fs');

const URL = /.*?(?:'|")(.*?)(?:'|").*?;/;
const IMPS = /@import.*?;/g;

function handle (text, input, callback) {
	var imps = text.match(IMPS) || [];

	if (imps.length) {
		var imp = imps[0];
		var path = Path.join(input.directory, imp.replace(URL, '$1'));

		if (path === input.absolute) {
			return callback(new Error('circlular import ' + path));
		}

		Fs.readFile(path, 'utf8', function (error, data) {
			if (error) {
				return callback(error);
			} else {
				text = text.replace(imp, data);
				return handle(text, input, callback);
			}
		});
	} else {
		return callback(undefined, text);
	}
}

module.exports = function (text, input, output, result) {
	text = result || text;

	return new Promise(function (resolve, reject) {
		handle(text, input, function (error, data) {
			if (error) {
				return reject(error);
			} else {
				return resolve(data);
			}
		});
	});
};
