'use strict';

const Events = require('events');
const Path = require('path');
const Fs = require('fs');

function Watcher (dirs) {
	Events.EventEmitter.call(this);
	this.stamp = Date.now();
	this.lastPath = '';
	this.watchers = [];
}

Watcher.prototype = Object.create(Events.EventEmitter.prototype);
Watcher.prototype.constructor = Watcher;

Watcher.prototype.error = function (error) {
	this.emit('error', error);
};

Watcher.prototype.change = function (path, type, name) {
	path = Path.join(path, name);
	if (type === 'change') {
		if (this.stamp < Date.now()-300) {
			this.stamp = Date.now();
			this.emit('change', path);
		}
	} else if (type === 'rename') {
		if (Fs.existsSync(path)) {
			this.emit('add', path);
		} else {
			this.emit('remove', path);
		}
	}
};

Watcher.prototype.find = function (path) {
	for (var i = 0, l = this.watchers.length; i < l; i++) {
		if (path === this.watchers[i][0]) {
			return this.watchers[i][1];
		}
	}
};

Watcher.prototype.close = function () {
	for (var i = 0, l = this.watchers.length; i < l; i++) {
		this.watchers[i][1].close();
	}
};

Watcher.prototype._handleWatch = function (path) {
	var self = this;
	self.watchers.push([
		path,
		Fs.watch(
			path,
			self.change.bind(self, path)
		)
	]);
};

Watcher.prototype._handleChild = function (path) {
	var self = this;
	Fs.stat(path, function (error, stat) {
		if (error) {
			self.error(error);
		} else if (stat.isDirectory()) {
			self.open(path);
		}
	});
};

Watcher.prototype._handleChildren = function (path) {
	var self = this;
	Fs.readdir(path, 'utf8', function (error, paths) {
		if (error) {
			self.error(error);
		} else {
			for (var i = 0, l = paths.length; i < l; i++) {
				self._handleChild(Path.join(path, paths[i]));
			}
		}
	});
};

Watcher.prototype.open = function (path) {
	var self = this;
	Fs.stat(path, function (error, stat) {
		if (error) {
			self.error(error);
		} else {
			if (stat.isDirectory()) {
				self._handleWatch(path);
				self._handleChildren(path);
			} else if (stat.isFile()) {
				self._handleWatch(path);
			}
		}
	});
};

module.exports = Watcher;

// var w = new Watcher();
//
// w.on('change', function (path) {
// 	console.log(`change: ${path}`);
// });
//
// w.on('add', function (path) {
// 	console.log(`add: ${path}`);
// });
//
// w.on('remove', function (path) {
// 	console.log(`remove: ${path}`);
// });
//
// w.on('error', function (error) {
// 	console.log(error);
// });
//
// w.open(__dirname + '/src');
