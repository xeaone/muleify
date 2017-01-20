const Globals = {

	lb: /(\.l\.)|(\.b\.)/g,

	layout: null,
	variables: new Map(),

	ignoreables: [
		'dev',
		'dist',
		'ignore',
		'node_modules',
		'.DS_Store',
		'.git',
		'(\\.p\\.)',
		'(\\.i\\.)'
	],

	commentRegExp: /(<!--(\s*)\{([^\}]*)\}(\s*)-->)/g,

	startDataRegExp: /(<!--(\s*)\{)/g,
	endDataRegExp: /(\}(\s*)-->)/g,

	layoutRegExp: /(<!--(\s*)\{(\s*)(\"|\')(\s*)(layout)(\s*)(\"|\')(\s*)(:)(\s*)(\"|\')(.*?)(\"|\')(\s*)\}(\s*)-->)/ig,
	partialRegExp: /(<!--(\s*)\{(\s*)(\"|\')(\s*)(partial)(\s*)(\"|\')(\s*)(:)(\s*)(\"|\')(.*?)(\"|\')(\s*)\}(\s*)-->)/ig,
	variableRegExp: /(<!--(\s*)\{(\s*)(\"|\')(\s*)(variable)(\s*)(\"|\')(\s*)(:)(\s*)(\"|\')(.*?)(\"|\')(\s*)\}(\s*)-->)/ig

};

module.exports = Globals;
