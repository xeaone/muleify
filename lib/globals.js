const Config = require('./config');

const Globals = {
	layout: null,
	variables: new Map(),
	ignoreables: Config.ignoreables
};

module.exports = Globals;
