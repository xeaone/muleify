/*
	@banner
	I am still here.
*/

import { one, two} from './one.i.js';
import { add } from './add.i.js';

/*
	@preserve
	I am still here again
*/

(async function() {
	const sum = await add(one, two);
	console.log(`${sum}`);'use strict';
}()).catch(function (error) {
	console.error(error);
});

console.log('bundle');

export default { add }
/*
const p = Promise.resolve().then(function () {
    return 'hello world';
});

(async function () {

    const r = await p();
    console.log(r);

}()).catch(function (e) {
    console.log(e);
});
*/
