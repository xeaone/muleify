'use strict';

const RollupResolve = require('@rollup/plugin-node-resolve');
const RollupCommon = require('@rollup/plugin-commonjs');
const Rollup = require('rollup');

module.exports = async function (text, input, output) {

	const bundle = await Rollup.rollup({
		external: false,
		input: input.absolute,
		plugins: [ RollupResolve(), RollupCommon() ]
	});

	const name = output.baseMain.charAt(0).toUpperCase() + output.baseMain.slice(1);

	const generate = await bundle.generate({
		name,
		indent: '\t',
		format: 'umd',
		amd: { id: name }
	});

    text = '';

    for (const { code } of generate.output) {
        if (code) {
            text += code;
        }
    }

	return text;
};
