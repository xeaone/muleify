module.exports = function (text, start, end) {
	var matches = [], i, l, c, match;
	var ml = matches.length;
	var sl = start.length;
	var el = end.length;

	for (i = 0, l = text.length; i < l; i++) {

		if (text[i] === start[0]) {
			c = 1;
			match = true;

			for (c; c < sl; c++) {
				if (text[i+c] !== start[c]) {
					match = false;
					break;
				}
			}

			if (match) {
				matches.push({ start: i });
			}

		} else if (text[i] === end[0]) {
			c = 1;
			match = true;

			for (c; c < el; c++) {
				if (text[i+c] !== end[c]) {
					match = false;
					break;
				}
			}

			if (match) {
				ml = matches.length-1;
				matches[ml].end = i+el-1;
				matches[ml].text = text.slice(matches[ml].start, matches[ml].end+1);
			}

		}

	}

	return matches;
};
