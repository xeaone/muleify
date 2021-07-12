'use strict';

const Muleify = require('../index');
const Path = require('./path.js');

module.exports.Pack = {
    key: 'p',
    name: 'pack',
    description: 'Packs folder or file',
    options: [ 'input', 'output' ],
    async handler (options, results) {
        const input = await Path.call(this, options.input);
        const output = await Path.call(this, options.output);
        await Muleify.packer(input, output, results);
        this.log(`Packed: ${input} to ${output}`, [ 'green' ]);
        return true;
    },
    operations: [
        {
            key: 'b',
            name: 'bundle',
            description: 'Bundles the output',
            async handler () { return true; }
        },
        {
            key: 'm',
            name: 'minify',
            description: 'Minifies the output',
            async handler () { return true; }
        },
        {
            key: 't',
            name: 'transpile',
            description: 'Transpile the output',
            async handler () { return true; }
        },
        {
            key: 'w',
            name: 'watch',
            description: 'Watches folder or file',
            async handler (options, results) {
                const self = this;
                const input = await Path.call(this, options.input);
                const output = await Path.call(this, options.output);
                const watcher = await Muleify.watcher(input, results);

                watcher.on('error', function (error) {
                    self.error(error.stack);
                });

                watcher.on('change', function (path) {
                    Promise.resolve().then(function () {
                        return Muleify.packer(input, output, results);
                    }).then(function () {
                        self.log(`Changed: ${path}`, [ 'magenta' ]);
                    }).catch(function (error) {
                        self.error(error.stack);
                    });
                });

                self.log(`Watched: ${input} to ${output}`, [ 'green' ]);

                return true;
            }
        }
    ]
};

module.exports.Serve = {
    key: 's',
    name: 'serve',
    description: 'Serves folder or file',
    options: [ 'path' ],
    async handler (options, results) {
        const path = await Path.call(this, options.path || options.output);
        const server = await Muleify.server(path, results);
        this.log(`Served: ${server.host}:${server.port}`, [ 'green' ]);
        return true;
    },
    operations: [
        {
            key: 's',
            name: 'spa',
            description: 'Enables single page application mode',
            async handler () { return true; }
        },
        {
            key: 'c',
            name: 'cors',
            description: 'Enables cross origin resource sharing mode',
            async handler () { return true; }
        }
    ]
};

module.exports.Map = {
    key: 'm',
    name: 'map',
    options: [ 'input', 'output', 'domain' ],
    description: 'Creates XML sitemap',
    async handler (options) {
        this.log('Mapping', [ 'underline', 'cyan' ]);
        const input = await Path.call(this, options.input);
        const output = await Path.call(this, options.output);
        await Muleify.map(input, output, options.domain);
        this.log(`Input: ${input}`, [ 'magenta' ]);
        this.log(`Output: ${output}`, [ 'magenta' ]);
    },
    operations: []
};

module.exports.Encamp = {
    key: 'e',
    name: 'encamp',
    options: [ 'input', 'output' ],
    description: 'Creates folders and files from a json file',
    async handler (options) {
        this.log('Muleify Encamping', [ 'underline', 'cyan' ]);
        const input = await Path.call(this, options.input);
        const output = await Path.call(this, options.output);
        await Muleify.encamp(input, output);
        this.log(`Input: ${options.input}`, [ 'magenta' ]);
        this.log(`Output: ${options.output}`, [ 'magenta' ]);
    }
};

module.exports.InstallSass = {
    key: 'i',
    name: 'install-sass',
    description: 'Installs sass/scss compiler (might require sudo)',
    async handler () {
        this.log('Installing...', [ 'white' ]);
        const data = await Muleify.sass();
        this.log(data, [ 'white' ]);
    }
};
