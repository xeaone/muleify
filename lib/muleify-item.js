'use strict';

const Path = require('path');
const When = require('when');
const Fs = require('fs');
const Config = require('./config');
const Helpers = require('./helpers');

function MuleifyItem (readPath, cwd) {
	var self = this;

	self.name = readPath;

	self.text = '';

	self.data = [];
	self.importFiles = new Map();
	self.importVariables = new Map();
	self.exportVariables = new Map();

	self.isData = true;
	self.isIncludes = true;
	self.isVariables = true;

	self.writePath = '';
	self.readPath = readPath;
	self.absoluteDirctory = Path.dirname(readPath);

	self.dist = Path.resolve('dist');

	self.cwd = cwd;
	self.ext = Path.extname(readPath);

	self.setupDataCount = 0;
	self.isSetupDataMax = false;
}

MuleifyItem.prototype.setup = function () {
	const self = this;

	return self.setText()
	.then(function () {
		return self.setWritePath();
	})
	.then(function () {
		return self.setupData();
	})
	.catch(function (error) {
		throw error;
	});
};

MuleifyItem.prototype.setupData = function () {
	const self = this;

	/*
	console.log(self.name);
	console.log(self.text.cleanWhiteSpace());
	console.log('\n\n');
	*/

	// remove after fix
	self.setupDataCount++;
	self.isSetupDataMax = (self.setupDataCount > 1000) ? true : false;

	return self.setData().
	then(function () {
		return self.appendData();
	})
	.then(function () {
		if (self.isSetupDataMax) throw new Error('MuleifyItem.setupData looped ' + self.setupDataCount);
		else if (self.isData === true) return self.setupData();
		else return null;
	})
	.catch(function (error) {
		throw error;
	});
};

MuleifyItem.prototype.setWritePath = function () {
	const self = this;

	self.writePath = self.readPath.replace(self.cwd, self.dist);
	return When.resolve();
};

MuleifyItem.prototype.setText = function () {
	const self = this;

	return Helpers.readFile(self.readPath)
	.then(function (data) {
		self.text = data;
	})
	.catch(function (error) {
		throw error;
	});
};

MuleifyItem.prototype.setData = function () {
	const self = this;

	return When.promise(function(resolve) {
		const dataCommentRegExp = new RegExp(Config.dataCommentRegExpString, 'ig');
		const dataCommentStrings = self.text.match(dataCommentRegExp) || [];

		self.isData = (dataCommentStrings.length > 0) ? true : false;

		if (self.isData === false) return resolve(); // stops looping

		dataCommentStrings.forEach(function (dataCommentString) {
			const comment = dataCommentString;
			const string = comment.cleanComment();
			const json = JSON.parse(string.prepareJson());
			const key = Object.keys(json)[0];
			const value = Object.values(json)[0];
			const path = Path.resolve(self.absoluteDirctory, value);

			const data = {
				key: key,
				value: value,
				json: json,
				string: string,
				comment: comment,
				path: (Helpers.validPathSync(path)) ? path : null
			};

			if (key !== 'import') self.exportVariables.set(data.key, data);
			else if (data.path) self.importFiles.set(data.value, data);
			else self.importVariables.set(data.value, data);
		});

		return resolve();
	});
};

MuleifyItem.prototype.appendData = function () {
	const self = this;

	return When.promise(function (resolve) {
		var exportVariable = null;
		var text = null;

		if (self.isData === false) return resolve(); // stops looping

		// import files
		if (self.importFiles.size > 0) {
			self.importFiles.forEach(function (importFile) {
				text = Fs.readFileSync(importFile.path, 'utf8'); //TODO: might need catch
				self.text = self.text.replace(importFile.comment, text);
			});

			self.importFiles.clear();
		}

		// import variables
		if (self.importVariables.size > 0) {

			self.importVariables.forEach(function (importVariable) {

				if (self.exportVariables.has(importVariable.value) === true) {

					// get the export variable
					exportVariable = self.exportVariables.get(importVariable.value);

					// replace the import variable comment with the export variable value
					self.text = self.text.replace(importVariable.comment, exportVariable.value);

					// replace the export variable comment with nothing
					self.text = self.text.replace(exportVariable.comment, '');
				} else {
					self.text = self.text.replace(importVariable.comment, '');
				}
			});

			self.importVariables.clear();
		}

		return resolve();
	});
};



module.exports = MuleifyItem;

/*
	internals
*/

String.prototype.cleanWhiteSpace = function () {
	var allWhiteSpaceRegExp = new RegExp(Config.allWhiteSpaceRegExpString, 'ig');
	return this.replace(allWhiteSpaceRegExp, '');
};

String.prototype.cleanComment = function () {
	var startDataRegExp = new RegExp(Config.startDataRegExpString);
	var endDataRegExp = new RegExp(Config.endDataRegExpString);
	return this.replace(startDataRegExp, '{').replace(endDataRegExp, '}');
};

String.prototype.cleanInclude = function () {
	var startIncludeRegExp = new RegExp(Config.startIncludeRegExpString);
	var endIncludeRegExp = new RegExp(Config.endIncludeRegExpString);
	return this.replace(startIncludeRegExp, '').replace(endIncludeRegExp, '');
};

String.prototype.prepareJson = function () {
	var singleQuoteRegExp = new RegExp('\'', 'ig');
	return this.replace(singleQuoteRegExp, '\"');
};

Object.prototype.values = function (object) {
	var values = [];
	for (var key in object) { if (object.hasOwnProperty(key)) values.push(object[key]); }
	return values;
};
