const NodeWatch = require('node-watch');
const Porty = require('porty');
const Servey = require('servey');
const Path = require('path');
const Fs = require('fs');

const PORT = 8080;

module.exports = function (input, output, options, start, stop, change, error) {
	Porty.get(PORT, function (port) {

		try {
			input = Fs.statSync(input).isFile() ? Path.dirname(input) : input;
		} catch (e) {
			if (error) error(e);
		}

		const server = Servey({
			port: port,
			spa: options.spa,
			directory: Path.extname(output) === '' ? output :  Path.dirname(output)
		});

		const watcher = NodeWatch(input, {
			recursive: true
		});

		server.open(function () {
			if (start) start(server);

			watcher.on('change', function (path) {
				if (change) change(path);
			});

			watcher.on('error', function (e) {
				if (error) error(e);
			});
		});

		process.on('SIGINT', function () {
			if (stop) stop();
			watcher.close();
			server.close();
			process.exit();
		});

		process.on('uncaughtException', function (e) {
			if (error) error(e);
			watcher.close();
			server.close();
			process.exit();
		});

	});
};


// module.exports = function (input, output, options, start, stop, change, error) {
// 	Porty.get(PORT, function (port) {
//
// 		if (options.spa) {
// 			handler = function (req, res) {
// 				var ex = Path.extname(req.path);
//
// 				if (ex === '.html' || ex === '.htm' || ex === '') {
// 					res.file(output + '/index.html');
// 				} else {
// 					res.file(output + req.path);
// 				}
//
// 			};
// 		} else {
// 			handler = {
// 				directory: {
// 					index: true,
// 					listing: true,
// 					path: output
// 				}
// 			};
// 		}
//
// 		const register = [{
// 			register: Inert
// 		}];
//
// 		const routes = [
// 			{
// 				method: 'GET',
// 				path: '/assets/{path*}',
// 				handler: {
// 					directory: {
// 						index: true,
// 						listing: true,
// 						path: output + '/assets'
// 					}
// 				}
// 			},
// 			{
// 				method: 'GET',
// 				path: '/asset/{path*}',
// 				handler: {
// 					directory: {
// 						index: true,
// 						listing: true,
// 						path: output + '/asset'
// 					}
// 				}
// 			},
// 			{
// 				method: 'GET',
// 				path: '/public/{path*}',
// 				handler: {
// 					directory: {
// 						index: true,
// 						listing: true,
// 						path: output + '/public'
// 					}
// 				}
// 			},
// 			{
// 				method: 'GET',
// 				path: '/{path*}',
// 				handler: handler
// 			}
// 		];
//
// 		const connection = {
// 			host: 'localhost',
// 			port: port,
// 			routes: {
// 				cors: true
// 			}
// 		};
//
// 		const server = new Hapi.Server();
// 		const watcher = NodeWatch(input);
//
// 		server.on('start', function () {
// 			if (start) start(server);
//
// 			try {
// 				input = Fs.statSync(input).isFile() ? Path.dirname(input) : input;
// 			} catch (e) {
// 				if (error) error(e);
// 			}
//
// 			watcher.on('change', function (path) {
// 				if (change) change(path);
// 			});
//
// 			watcher.on('error', function (e) {
// 				if (error) error(e);
// 			});
//
// 		});
//
// 		// server.on('stop', function () {
// 		// 	watcher.close();
// 		// 	if (stop) stop();
// 		// 	process.exit();
// 		// });
//
// 		server.on('error', function (e) {
// 			if (error) error(e);
// 		});
//
// 		process.on('SIGINT', function () {
// 			server.stop();
// 			watcher.close();
// 			if (stop) stop();
// 			process.exit();
// 		});
//
// 		process.on('uncaughtException', function (e) {
// 			if (error) error(e);
// 		});
//
// 		server.connection(connection);
// 		server.register(register);
// 		server.route(routes);
// 		server.start();
//
// 	});
// };
