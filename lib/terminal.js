const ChildProcess = require('child_process');

module.exports = function Terminal (data) {
	return new Promise(function (resolve, reject) {
		if (typeof data === 'string') data = { command: data };
		data.cwd = data.cwd || data.path;

		ChildProcess.exec(data.command, data, function (error, stdout, stderr) {
			if (error) {
				return reject(error.toString());
			} else if (stderr) {
				return resolve(stderr.toString());
			} else if (stdout) {
				return resolve(stdout.toString());
			}
		});

	});
};
