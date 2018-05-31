'use strict';

module.exports = {
	spa: {
		key: 's',
		name: 'spa',
		description: 'Enables single page application mode',
		method: async function () { return true; }
	},
	cors: {
		key: 'c',
		name: 'cors',
		description: 'Enables cross origin resource sharing mode',
		method: async function () { return true; }
	},
	domain: {
		key: 'd',
		name: 'domain',
		description: 'Inserts domain into sitemap',
		method: async function () { return true; }
	},
	bundle: {
		key: 'b',
		name: 'bundle',
		description: 'Bundles the output',
		method: async function () { return true; }
	},
	minify: {
		key: 'm',
		name: 'minify',
		description: 'Minifies the output',
		method: async function () { return true; }
	},
	transpile: {
		key: 't',
		name: 'transpile',
		description: 'Transpile the output',
		method: async function () { return true; }
	},
	watch: {
		key: 'w',
		name: 'watch',
		description: 'Watches a file or folder',
		method: async function () { return true; }
	},
	path: {
		key: 'p',
		name: 'path',
		description: 'Defines the path to watch',
		method: async function () { return path; }
	}
};
