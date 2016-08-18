
import two from './two.es6.js';

function say (cb) {
	cb(two);
}

say(w => {
	console.log(w);
});
