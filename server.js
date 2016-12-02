const Hapi = require('hapi');
const Chalk = require('chalk');
const Porty = require('porty');
const NodeWatch = require('node-watch');

const PORT = 8080;

module.exports = function (input, output, callback) {

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
			console.log(Chalk.magenta('From: ' + input));
			console.log(Chalk.magenta('To: ' + output));

			NodeWatch(input, {
				recursive: true,
				followSymLinks: false
			}, function (file) {
				callback(file);
			});
		});

	});

};
