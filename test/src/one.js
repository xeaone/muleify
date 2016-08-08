
import two from './two.js';

function say (cb) {
	cb(two);
}

say(w => {
	console.log(w);
});
