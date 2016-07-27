'use strict';

const Bluebird = require('bluebird');
const Path = require('path');
const Fse = require('fs-extra');
const Config = require('./config');
const MuleifyItem = require('./muleify-item');

const IGNOREABLES = ignoreablesRegExp();

exports.pack = function (path) {
	var pathObject = null;

	return createPaths(path)
	.then(function (data) {
		pathObject = data;
		return srcDirectoryExists(pathObject.cwd);
	})
	.then(function () {
		return getMuleifyItems(pathObject.src);
	})
	.then(function (muleifyItems) {
		var includes = [];

		muleifyItems.forEach(function (item) {
			includes.push.apply(includes, item.includes); //FIXME: adds duplicate includes
		});

		includes.forEach(function (item) {
			muleifyItems.delete(item.absolute);
		});

		return muleifyItems;
	})
	.catch(function (error) {
		throw error;
	});
};

exports.min = function (muleifyItems) {
	
};

exports.es6 = function (muleifyItems) {

};

/*
	internal
*/
function createPaths (path) {
	return new Promise(function (resolve) {
		var cwdPath = null;
		var srcPath = null;

		if (path === null || path === undefined || path === '') path = Path.resolve('.');

		path = Path.normalize(path);

		if (Path.isAbsolute(path)) cwdPath = path;
		else cwdPath = Path.resolve(path);

		srcPath = Path.join(cwdPath, 'src');

		resolve({ cwd: cwdPath, src: srcPath });
	});
}

function srcDirectoryExists (path) {
	path = path + Path.sep + 'src';

	return new Promise (function (resolve, reject) {
		Fse.stat(path, function (error, stats) {
			if (error === null) resolve();
			else if (error.code === 'ENOENT' || stats.isFile()) reject('Error: missing \"src\" directory');
			else throw error;
		});
	});
}

function getMuleifyItems (path) {
	return new Promise (function (resolve, reject) {
		var muleifyItemPromises = [];
		var muleifyItems = new Map();

		var options = {
			filter: function (currentPath) {
				var pathRelative = currentPath.replace(path + Path.sep, '');
				return !IGNOREABLES.test(pathRelative);
			}
		};

		Fse.walk(path, options)
		.on('data', function (item) {
			if (item.stats.isFile()) {
				muleifyItemPromises.push(
					MuleifyItem(item.path, path).then(function (self) {
						muleifyItems.set(self.readPath, self);
					})
				);
			}
		})
		.on('end', function () {
			Bluebird.all(muleifyItemPromises)
			.then(function () {
				resolve(muleifyItems);
			});
		})
		.on('error', function (error) {
			reject(error);
		});
	});
}

function ignoreablesRegExp () {
	var ignoreables = Config.ignoreables;
	var res = '';

	for (var i = 0; i < ignoreables.length; i++) {
		if (i !== 0) res = res + '|';
		res = res + ignoreables[i];
	}

	return new RegExp(res);
}
