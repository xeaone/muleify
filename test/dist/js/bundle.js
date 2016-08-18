(function () {
	'use strict';

	var two = 2;

	function say(cb) {
		cb(two);
	}

	say(function (w) {
		console.log(w);
	});
})();