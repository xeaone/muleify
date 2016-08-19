const Path = require('path');
const Hapi = require('hapi');
const Chalk = require('chalk');
const NodeWatch = require('node-watch');

module.exports = function (cwd, callback) {
	const dist = Path.join(cwd, 'dist');
	const src =  Path.join(cwd, 'src');

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
					path: dist
				}
			}
		}
	];

	const server = new Hapi.Server();

	server.connection({ host: 'localhost', port: 8080 });
	server.register(register, function(error){ if (error) throw error; });
	server.route(routes);

	server.start(function () {

		console.log(Chalk.green('Web: ' + server.info.uri));
		console.log(Chalk.gray('Src: ' + src));
		console.log(Chalk.gray('Dist: ' + dist));

		const options = {
			recursive: true,
			followSymLinks: false
		};

		NodeWatch(src, options, function (file) {
			callback(file);
		});
	});
};
