Function.prototype.myCall = function () {
	if (typeof this !== 'function') {
		throw new TypeError('error')
	}
	const args = Array.from(arguments)
	let context = args.shift()
	context = context ? context : window
	context.fn = this
	let result = context.fn(...args)
	delete context.fn
	return result
}
function fn1() {
	console.log(this)
}
const jnz = {
	name: 'jnz'
}
fn1.myCall(jnz)
