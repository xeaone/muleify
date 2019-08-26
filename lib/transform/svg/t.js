'use strict';

const Svgo = require('svgo');

const SVGO = new Svgo({
	multipass: true,
	js2svg: { indent: 4, pretty: true },
	floatPrecision: Math.min(Math.max(0, 3), 20),

	plugins: [
		// { minifyStyles: true },
		// { mergePaths: true },

		{ sortAttrs: true },
		{ collapseGroups: true },
		{ moveGroupAttrsToElems: true },
		{ moveElemsAttrsToGroup: false },

		{ removeDesc: true },
		{ removeTitle: true },
		{ removeDoctype: true },
		{ removeUnusedNS: true },
		{ removeMetadata: true },
		{ removeComments: true },
		{ removeViewBox: false },
		{ removeEmptyText: true },
		{ removeEmptyAttrs: true },
		{ removeDimensions: true },
		{ removeXMLProcInst: true },
		{ removeUselessDefs: true },
		{ removeHiddenElems: true },
		{ removeRasterImages: true },
		{ removeStyleElement: true },
		{ removeScriptElement: true },
		{ removeEditorsNSData: true },
		{ removeOffCanvasPaths: true },
		{ removeEmptyContainers: true },
		{ removeUnknownsAndDefaults: true },
		{ removeUselessStrokeAndFill: true },
		{ removeNonInheritableGroupAttrs: true },

		{ removeAttrs: { attrs: '(class)' } },

		{ cleanupIDs: true },
		{ cleanupAttrs: true },
		{ cleanupListOfValues: true },
		{ cleanupNumericValues: true },
		{ cleanupEnableBackground: true },

		{ convertColors: true },
		{ convertPathData: true },
		{ convertTransform: true },
		{ convertShapeToPath: true },
		{ convertStyleToAttrs: true },
		{ convertEllipseToCircle: true }

	]
});

module.exports = async function (text, input, output) {

	const result = await SVGO.optimize(text);

	text = result.data;

	return text;
};
