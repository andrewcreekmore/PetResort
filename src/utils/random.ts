
/*
===========================================================================
random.ts
- defines + exports custom rand util funcs (for use when seeding)
===========================================================================
*/

function randIntInRange(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randDateInRange(from: Date, to: Date) {
	const fromTime = from.getTime();
	const toTime = to.getTime();

	// ensure no future dates
	const possibleMax = [toTime, new Date()];
	var minMax = possibleMax.reduce(function (a, b) {
		return a < b ? a : b;
	});

	return new Date(
		fromTime + Math.random() * (+minMax - fromTime)
	);
}

export { randIntInRange, randDateInRange };