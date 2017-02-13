const Globals = {

	lb: /(\.l\.)|(\.b\.)/g,

	layout: null,
	variables: new Map(),

	ignoreables: [
		// 'dist',
		'ignore',
		'node_modules',
		'.DS_Store',
		'.git',
		'(\\.p\\.)',
		'(\\.i\\.)'
	],

	commentRegExp: /(<!--(\s*)\{([^\}]*)\}(\s*)-->)/ig,

	startDataRegExp: /(<!--(\s*)\{)/ig,
	endDataRegExp: /(\}(\s*)-->)/ig,

	layoutRegExp: /(<!--(\s*)\{(\s*)(\"|\')(\s*)(layout)(\s*)(\"|\')(\s*)(:)(\s*)(\"|\')(.*?)(\"|\')(\s*)\}(\s*)-->)/ig,
	partialRegExp: /(<!--(\s*)\{(\s*)(\"|\')(\s*)(partial)(\s*)(\"|\')(\s*)(:)(\s*)(\"|\')(.*?)(\"|\')(\s*)\}(\s*)-->)/ig,
	variableRegExp: /(<!--(\s*)\{(\s*)(\"|\')(\s*)(variable)(\s*)(\"|\')(\s*)(:)(\s*)(\"|\')(.*?)(\"|\')(\s*)\}(\s*)-->)/ig

};

module.exports = Globals;
