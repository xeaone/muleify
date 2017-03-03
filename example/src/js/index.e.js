/* @preserve I am still here. */

import { one, two} from './one.i.js';
import { add } from './add.i.js';

var sum = add(one, two);
console.log(`${sum}`);
console.log('bundle');
export default add;
