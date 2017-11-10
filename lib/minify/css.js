'use strict';

module.exports = async function (data) {
	return data
		.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\//g, '') // comments
		.replace( /\s*({|}|;|:|!)\s*/g, '$1' ) // end white space
		.replace(/[\r\n\t]+/g, '') // lines tabs
		.replace(/\s{2,}/g, ' ' ) // double white space
}
