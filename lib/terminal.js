const ChildProcess = require('child_process');

module.exports = function Terminal (data) {
	return new Promise(function (resolve, reject) {
		if (typeof data === 'string') data = { cmd: data };
		data.args = data.args || [];

		var stdout = '';
		var stderr = '';
		var child = ChildProcess.spawn(data.cmd, data.args, data);

		child.stdout.on('data', function (data) {
			stdout += stdout;
		});

		child.stderr.on('data', function (data) {
			stderr += stderr;
		});

		child.on('error', function (error) {
			return reject(error);
		});

		child.on('close', function (code) {
			if (stderr) {
				return resolve(stderr);
			} else if (stdout) {
				return resolve(stdout);
			}
		});

	});
};
