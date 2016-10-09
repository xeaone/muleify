const Config = require('./config');

const Globals = {
	paths: {},

	options: {
		output: null
	},

	path: null,
	file: null,
	layout: null,

	variables: new Map(),

	ignoreables: Config.ignoreables,

	walk: {
		ignoreDot: true,
		filters: Config.ignoreables
	}
};

module.exports = Globals;
