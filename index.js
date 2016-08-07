'use strict';

const When = require('when');
const Path = require('path');
const Fsep = require('fsep');

const Partial = require('./lib/partial');
const Page = require('./lib/page');
const Globals = require('./lib/globals');

exports.pack = function (path) {

	Globals.paths = createPaths(path);

	return When.all([getPages(), getPartials(), getOthers()])
	.then(function () {
		return setupPartials();
	}).then(function () {
		return setupPages();
	}).then(function () {
		console.log(Globals.pages);
	}).catch(function (error) { throw error; });
};


/*
	internal
*/
function createPaths (path) {
	var cwdPath = null;
	var srcPath = null;
	var pagesPath = null;
	var partialsPath = null;

	if (path === null || path === undefined || path === '') path = Path.resolve('.');

	path = Path.normalize(path);

	if (Path.isAbsolute(path)) cwdPath = path;
	else cwdPath = Path.resolve(path);

	srcPath = Path.join(cwdPath, 'src');
	pagesPath = Path.join(srcPath, 'pages');
	partialsPath = Path.join(srcPath, 'partials');

	return {
		cwd: cwdPath,
		src: srcPath,
		pages: pagesPath,
		partials: partialsPath
	};
}

function getPages () {
	return Fsep.valid(Globals.paths.pages).then(function (isValid) {

		if (!isValid) return null;
		return Fsep.walk(Globals.paths.pages);

	}).then(function (pagePaths) {

		pagePaths.forEach(function (pagePath) {
			Globals.pagePaths.push(pagePath);
		});

	}).catch(function (error) { throw error; });
}

function getPartials () {
	return Fsep.valid(Globals.paths.partials).then(function (isValid) {

		if (!isValid) return null;
		return Fsep.walk(Globals.paths.partials);

	}).then(function (partialPaths) {

		partialPaths.forEach(function (partialPath) {
			Globals.partialPaths.push(partialPath);
		});

	}).catch(function (error) { throw error; });
}

function getOthers () {
	return Fsep.valid(Globals.paths.src).then(function (isValid) {

		if (!isValid) throw new Error('Missing src directory');

		const options = {
			path: Globals.paths.src,
			filters: ['pages', 'partials']
		};

		return Fsep.walk(options);

	}).then(function (otherPaths) {

		otherPaths.forEach(function (otherPath) {
			Globals.otherPaths.push(otherPath);
		});

	}).catch(function (error) { throw error; });
}

function setupPages () {
	var pagePromises = Globals.pagePaths.map(function (pagePath) {
		var options = {
			rel: pagePath,
			paths: Globals.paths,
			partials: Globals.partials
		};

		return Page(options);
	});

	return When.all(pagePromises).then(function (pages) {
		pages.forEach(function (page) {
			Globals.pages.set(page.rel, page);
		});
	}).catch(function (error) { throw error; });
}

function setupPartials () {
	var partialPromises = Globals.partialPaths.map(function (partialPath) {
		var options = {
			rel: partialPath,
			paths: Globals.paths
		};

		return Partial(options);
	});

	return When.all(partialPromises).then(function (partials) {
		partials.forEach(function (partial) {
			Globals.partials.set(partial.rel, partial);
		});
	}).catch(function (error) { throw error; });
}
