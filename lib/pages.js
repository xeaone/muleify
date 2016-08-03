'use strict';

const Path = require('path');
const When = require('when');
const Globals = require('./globals');
const Fsep = require('fsep');

function getPageData (path) {
	return Fsep.readFile(path, 'utf8').then(function (data) {
		return data;
	}).catch(function (error) {
		throw error;
	});
}
