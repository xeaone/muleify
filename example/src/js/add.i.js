
const promise = function () {
	return Promise.resolve('adding');
};

const add = async function (numOne, numTwo) {
	const message = await promise();
	console.log(message);
	return numOne + numTwo;
}

export { add };
