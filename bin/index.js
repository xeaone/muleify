#!/usr/bin/env node

const Operations = require('./operations.js');
const Package = require('../package.json');
const Cliy = require('cliy');

(async function() {

    const program = new Cliy();

    await program.setup({
    	name: Package.name,
    	version: Package.version,
    	operations: [
		    Operations.Pack,
		    Operations.Serve,
		    // Operations.Watch,
		    Operations.Map,
		    Operations.Encamp,
            Operations.InstallSass
		]
	});

    program.log('Muleify', ['underline', 'cyan']);

	await program.run(process.argv);

}()).catch(console.error);
