'use strict';

var Muleify = require('../index.js');
var commander = require('commander');

commander
	.version(process.env.npm_package_version)
	.option('-p, --pack', 'Create a Muleified web pack')
	.parse(process.argv);

if (commander.pack) Muleify.pack();
