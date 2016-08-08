'use strict';

const When = require('when');
const Path = require('path');
const Fsep = require('fsep');

const Partial = require('./lib/partial');
const Page = require('./lib/page');
const Other = require('./lib/other');
const Globals = require('./lib/globals');

exports.pack = function (path, options) {

	Globals.options = options;
	Globals.paths = createPaths(path);

	return When.all([getPages(), getPartials(), getOthers()])
	.then(function () {
		return setupPartials();
	}).then(function () {
		return setupPages();
	}).then(function () {
		return setupOthers();
	}).then(function () {
		return writeDist();
	}).then(function () {
		console.log(Globals.others);
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
		const scss = new RegExp('(.*?)\.(\.scss|\.sass)', 'ig');
		const indexScss = new RegExp('index.scss|index.sass|style.scss|index.sass', 'ig');

		const js = new RegExp('(.*?)\.(\.js)', 'ig');
		const indexJs = new RegExp('index.js', 'ig');

		otherPaths.forEach(function (otherPath) {
			if (otherPath.match(scss) || otherPath.match(js)) {
				if (otherPath.match(indexScss)) Globals.otherPaths.push(otherPath);
				if (otherPath.match(indexJs)) Globals.otherPaths.push(otherPath);
			} else {
				Globals.otherPaths.push(otherPath);
			}
		});

	}).catch(function (error) { throw error; });
}

function setupPages () {
	const pagePromises = Globals.pagePaths.map(function (pagePath) {
		return Page({
			rel: pagePath,
			paths: Globals.paths,
			partials: Globals.partials
		});
	});

	return When.all(pagePromises).then(function (pages) {
		pages.forEach(function (page) {
			Globals.pages.set(page.rel, page);
		});
	}).catch(function (error) { throw error; });
}

function setupPartials () {
	const partialPromises = Globals.partialPaths.map(function (partialPath) {
		return Partial({
			rel: partialPath,
			paths: Globals.paths
		});
	});

	return When.all(partialPromises).then(function (partials) {
		partials.forEach(function (partial) {
			Globals.partials.set(partial.rel, partial);
		});
	}).catch(function (error) { throw error; });
}

function setupOthers () {
	const otherPromises = Globals.otherPaths.map(function (otherPath) {
		return Other({
			rel: otherPath,
			paths: Globals.paths,
			options: Globals.options
		});
	});

	return When.all(otherPromises).then(function (others) {
		others.forEach(function (other) {
			Globals.others.set(other.rel, other);
		});
	}).catch(function (error) { throw error; });
}

function writeDist () {
	const pages = Globals.pages;
	const others = Globals.others;
	var promises = [];

	pages.forEach(function (page) {

	});

	others.forEach(function (other) {

	});

	//TODO: write files
}
