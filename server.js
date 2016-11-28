const Path = require('path');
const Hapi = require('hapi');
const Chalk = require('chalk');
const Porty = require('porty');
const NodeWatch = require('node-watch');

const PORT = 8080;

module.exports = function (options, callback) {
	const output = Path.join(options.path, options.output);
	const src =  Path.join(options.path, 'src');

	const register = [
		{
			register: require('inert')
		}
	];

	const routes = [
		{
			method: 'GET',
			path: '/{path*}',
			handler: {
				directory: {
					index: true,
					listing: true,
					path: output
				}
			}
		}
	];

	const server = new Hapi.Server();

	Porty.get(PORT, function (port) {

		server.connection({
			host: 'localhost',
			port: port,
			routes: {
				cors: true
			}
		});

		server.register(register, function(error) {
			if (error) throw error;
		});
		
		server.route(routes);

		server.start(function () {
			console.log(Chalk.green('Web: ' + server.info.uri));
			console.log(Chalk.magenta('From: ' + src));
			console.log(Chalk.magenta('To: ' + output));

			NodeWatch(src, {
				recursive: true,
				followSymLinks: false
			}, function (file) {
				callback(file);
			});
		});

	});

};
