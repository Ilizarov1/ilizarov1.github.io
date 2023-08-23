function float_add(a, b) {
	let posA = String(a).indexOf('.')
	let posB = String(b).indexOf('.')
	if (posA === -1 || posB === -1) {
		throw new TypeError('not float')
	}
	let digitA = String(a).length - posA - 1
	let digitB = String(b).length - posB - 1
	let digits = digitA > digitB ? digitA : digitB
	return (a + b).toFixed(digits)
}
console.log(float_add(0.21111111111, 0.1))
