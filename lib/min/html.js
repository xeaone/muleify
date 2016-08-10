//TODO: needs to be optimized

module.export.minHtml = function (html) {

	html = html.replace(/>(\n|\s|\s\s)*</g, '><');
	html = html.replace(/[a-z-]+=""/g, '');
	html = html.replace(/"([^ ]*)"/g, '$1');
	html = html.replace(/<\/li>/, '');

	return html;
};
