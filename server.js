require('when/monitor/console');

const Path = require('path');
const Hapi = require('hapi');
const Chalk = require('chalk');
const NodeWatch = require('node-watch');

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

	server.connection({
		host: 'localhost',
		port: 8080,
		routes: {
			cors: true
		}
	});

	server.register(register, function(error) { if (error) throw error; });
	server.route(routes);

	server.start(function () {

		console.log(Chalk.green('Web: ' + server.info.uri));
		console.log(Chalk.magenta('From: ' + src));
		console.log(Chalk.magenta('To: ' + output));

		const options = {
			recursive: true,
			followSymLinks: false
		};

		NodeWatch(src, options, function (file) {
			callback(file);
		});
	});
};
