const When = require('when');
const Path = require('path');
const Fsep = require('fsep');

const Partial = require('./lib/partial');
const Page = require('./lib/page');
const Others = require('./lib/others');
const Globals = require('./lib/globals');

exports.pack = function (path, options) {

	Globals.options = options;
	Globals.paths = createPaths(path);

	return When.all([getPages(), getPartials(), Others.get()])
	.then(function () {

		return setupPartials();

	}).then(function () {

		return setupPages();

	}).then(function () {

		return Others.set();

	// }).then(function () {
	// 	return writeDist();
	// }).then(function () {
	// 	console.log(Globals.others);
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

// function writeDist () {
// 	const pages = Globals.pages;
// 	const others = Globals.others;
// 	var promises = [];
//
// 	pages.forEach(function (page) {
//
// 	});
//
// 	others.forEach(function (other) {
//
// 	});
//
// 	//TODO: write files
// }
