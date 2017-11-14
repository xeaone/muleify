'use strict';

module.exports = async function (paths, domain) {
	var data = {};

	domain = domain ? domain : '/';
	domain = domain[domain.length-1] !== '/' ? domain + '/' : domain;

	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();

	day = day < 10 ? '0' + day : day;
	month = month < 10 ? '0' + month : month;

	data.middle = paths.join(`</loc>\n\t\t<lastmod>${year}-${month}-${day}</lastmod>\n\t</url>\n\t<url>\n\t\t<loc>${domain}`);
	data.middle = domain + data.middle;
	data.middle = `\t<url>\n\t\t<loc>${data.middle}</loc>\n\t\t<lastmod>${year}-${month}-${day}</lastmod>\n\t</url>`;

	data.main = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${data.middle}\n</urlset>`;

	return data.main;
};
