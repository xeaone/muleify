'use strict';

module.exports = async function (text, input, output) {
    return text
        .replace(/>\s+</g, '><')
        .replace(/[a-z-]+=""/g, '')
        .replace(/"([^ ]*)"/g, '$1')
        .replace(/<\/li>/, '');
};
