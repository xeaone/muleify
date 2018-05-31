'use strict';

const Path = require('path');
const Fs = require('fs');

module.exports = async function (argument, required) {
	const data = {};

	data.input = argument ? argument.split(/\s+/)[0] : '';
	data.output = argument ? argument.split(/\s+/)[1] : '';

	data.input = Path.resolve(process.cwd(), data.input);

	if (!Fs.existsSync(data.input)) {
		throw new Error(`Input path does not exist ${data.input}`);
	}

	if (data.output) {
		data.output = Path.resolve(process.cwd(), data.output);
	}

	if (required !== false && !Fs.existsSync(data.output)) {
		throw new Error(`Output path does not exist ${data.output}`);
	}

	return data;
};
