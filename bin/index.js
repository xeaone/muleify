#!/usr/bin/env node

const Operations = require('./operations');
const Package = require('../package');
const Cliy = require('cliy');

(async function() {

    const program = new Cliy();

    await program.setup({
    	name: Package.name,
    	version: Package.version,
    	operations: [
		    Operations.Pack,
		    Operations.Serve,
		    Operations.Watch,
		    Operations.Map,
		    Operations.Encamp,
            Operations.InstallSass
		]
	});

	await program.run(process.argv);

}()).catch(console.error);
