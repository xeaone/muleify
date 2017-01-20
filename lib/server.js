const NodeWatch = require('node-watch');
const Porty = require('porty');
const Inert = require('inert');
const Hapi = require('hapi');
const Path = require('path');
const Fs = require('fs');

const PORT = 8080;

module.exports = function (input, output, start, stop, change, error) {
	Porty.get(PORT, function (port) {

		const register = [{
			register: Inert
		}];

		const routes = [{
			method: 'GET',
			path: '/{path*}',
			handler: {
				directory: {
					index: true,
					listing: true,
					path: output
				}
			}
		}];

		const connection = {
			host: 'localhost',
			port: port,
			routes: {
				cors: true
			}
		};

		const server = new Hapi.Server();
		const watcher = NodeWatch(input);

		server.on('start', function () {
			if (start) start(server);

			try {
				input = Fs.statSync(input).isFile() ? Path.dirname(input) : input;
			} catch (e) {
				if (error) error(e);
			}

			watcher.on('change', function (path) {
				if (change) change(path);
			});

			watcher.on('error', function (e) {
				if (error) error(e);
			});

		});

		// server.on('stop', function () {
		// 	watcher.close();
		// 	if (stop) stop();
		// 	process.exit();
		// });

		server.on('error', function (e) {
			if (error) error(e);
		});

		process.on('SIGINT', function () {
			server.stop();
			watcher.close();
			if (stop) stop();
			process.exit();
		});

		process.on('uncaughtException', function (e) {
			if (error) error(e);
		});

		server.connection(connection);
		server.register(register);
		server.route(routes);
		server.start();

	});
};
