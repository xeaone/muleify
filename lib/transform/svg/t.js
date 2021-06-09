'use strict';

const Svgo = require('svgo');

module.exports = async function (text, input, output) {

	const result = await Svgo.optimize(text, {
		multipass: true,
		js2svg: { indent: 4, pretty: true },
		floatPrecision: Math.min(Math.max(0, 3), 20),

		plugins: [
			// { minifyStyles: true },
			// { mergePaths: true },
			// 'removeViewBox: false },
			// { moveElemsAttrsToGroup: false },
			// { removeAttrs: { attrs: '(class)' } },

			'sortAttrs',
			'collapseGroups',
			'moveGroupAttrsToElems',

			'removeDesc',
			'removeTitle',
			'removeDoctype',
			'removeUnusedNS',
			'removeMetadata',
			'removeComments',
			'removeEmptyText',
			'removeEmptyAttrs',
			'removeDimensions',
			'removeXMLProcInst',
			'removeUselessDefs',
			'removeHiddenElems',
			'removeRasterImages',
			'removeStyleElement',
			'removeScriptElement',
			'removeEditorsNSData',
			'removeOffCanvasPaths',
			'removeEmptyContainers',
			'removeUnknownsAndDefaults',
			'removeUselessStrokeAndFill',
			'removeNonInheritableGroupAttrs',

			'cleanupIDs',
			'cleanupAttrs',
			'cleanupListOfValues',
			'cleanupNumericValues',
			'cleanupEnableBackground',

			'convertColors',
			'convertPathData',
			'convertTransform',
			'convertShapeToPath',
			'convertStyleToAttrs',
			'convertEllipseToCircle'
		]

	});

	text = result.data;

	return text;
};
