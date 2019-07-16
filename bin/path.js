'use strict';

const Fs = require('fs');
const Path = require('path');

module.exports = async function (data) {
    const path = Path.resolve(process.cwd(), data);

	if (!Fs.existsSync(path)) {
		throw this.mix(`Path does not exist ${path}`, ['red']);
	}

    return path;
};
