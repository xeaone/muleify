const Config = require('./config');

exports.min = function (muleifyItems) {
	var allCommentsRegExp = new RegExp(Config.allCommentsRegExpString, 'ig');
	var allWhiteSpaceRegExp = new RegExp(Config.allWhiteSpaceRegExpString, 'ig');

	muleifyItems.forEach(function (item, index, array) {
		item.text = item.text.replace(allCommentsRegExp, '');
		item.text = item.text.replace(allWhiteSpaceRegExp, '');
		array[index] = item;
	});
};
