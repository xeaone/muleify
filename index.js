'use strict';

const When = require('when');
const Chalk = require('chalk');
const Path = require('path');
const Fsep = require('fsep');

const Helpers = require('./lib/helpers');
const Config = require('./lib/config');
const Globals = require('./lib/globals');

exports.pack = function (path) {

	return createPaths(path)
	.then(function () {
		return verifyFilesDirectories();
	})
	.then(function () {
		return getFilesDirectories();
	})
	.then(function () {
		return getLayoutData();
	})
	.then(function () {
		console.log(Globals.layoutHtml);
		//TODO: modify files
	})
	.catch(function (error) {
		throw error;
	});
};


/*
	internal
*/
function createPaths (path) {
	return When.promise(function (resolve) {
		var cwdPath = null;
		var srcPath = null;

		if (path === null || path === undefined || path === '') path = Path.resolve('.');

		path = Path.normalize(path);

		if (Path.isAbsolute(path)) cwdPath = path;
		else cwdPath = Path.resolve(path);

		srcPath = Path.join(cwdPath, 'src');

		Globals.paths = {
			cwd: cwdPath,
			src: srcPath,
			layouts: Path.join(srcPath, 'layouts'),
			pages: Path.join(srcPath, 'pages'),
			partials: Path.join(srcPath, 'partials')
		};

		return resolve(Globals.paths);
	});
}

function verifyFilesDirectories () {
	return Fsep.valid(Globals.paths.src)
	.then(function (isValid) {
		if (!isValid) throw new Error('Missing src directory');
		return Fsep.valid(Globals.paths.layouts);
	})
	.then(function (isValid) {
		Globals.isLayouts = isValid;
		if (!isValid) console.log(Chalk.yellow('Missing \"layouts\" directory'));
		return Fsep.valid(Globals.paths.pages);
	})
	.then(function (isValid) {
		Globals.isPages = isValid;
		if (!isValid) console.log(Chalk.yellow('Missing \"pages\" directory'));
		return Fsep.valid(Globals.paths.partials);
	})
	.then(function (isValid) {
		Globals.isPartials = isValid;
		if (!isValid) console.log(Chalk.yellow('Missing \"partials\" directory'));
	})
	.catch(function (error) {
		throw error;
	});
}

function getFilesDirectories () {
	return When.all([getLayouts(), getPages(), getPartials(), getOthers()])
	.then(function (values) {

		values[0].forEach(function (layout) {
			Globals.layouts.push(layout);
		});

		values[1].forEach(function (page) {
			Globals.pages.push(page);
		});

		values[2].forEach(function (partial) {
			Globals.partials.push(partial);
		});

		values[3].forEach(function (others) {
			Globals.others.push(others);
		});

	})
	.catch(function (error) {
		throw error;
	});
}

function getLayouts () {
	return Fsep.walk(Globals.paths.layouts)
	.then(function (files) {
		return files;
	})
	.catch(function (error) {
		throw error;
	});
}

function getPages () {
	return Fsep.walk(Globals.paths.pages)
	.then(function (files) {
		return files;
	})
	.catch(function (error) {
		throw error;
	});
}

function getPartials () {
	return Fsep.walk(Globals.paths.partials)
	.then(function (files) {
		return files;
	})
	.catch(function (error) {
		throw error;
	});
}

function getOthers () {
	var options = {
		path: Globals.paths.src,
		filters: ['layouts', 'pages', 'partials']
	};

	return Fsep.walk(options)
	.then(function (files) {
		return files;
	})
	.catch(function (error) {
		throw error;
	});
}

function getLayoutData () {
	var path = Path.join(Globals.paths.layouts, Globals.layouts[0]);

	return Fsep.readFile(path, 'utf8').then(function (data) {
		Globals.layoutHtml = data;
	})
	.catch(function (error) {
		throw error;
	});
}
