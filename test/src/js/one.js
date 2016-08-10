
import { look } from './two.js';

function say (cb) {
	look();
	cb(two);
}

say(w => {
	console.log(w);
});
