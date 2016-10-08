const Globals = require('../../globals');
const WhenNode = require('when/node');
const Sass = WhenNode.liftAll(require('node-sass'));

module.exports = function (text, paths) {

	const options = {
		data: text,
		includePaths: [
			Globals.paths.src,
			paths.directory
		]
	};

	return Sass.render(options).then(function (result) {

		return result.css.toString();

	}).catch(function (error) { throw error; });

};
