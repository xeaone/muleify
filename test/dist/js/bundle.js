function look () {
	console.log('look');
}

function say (cb) {
	look();
	cb(two);
}

say(w => {
	console.log(w);
});