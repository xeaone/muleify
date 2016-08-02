
function say (cb) {
	cb('hello world');
}

say(w => {
	console.log(w);
});
