Function.prototype.myApply = function () {
	if (typeof this !== 'function') {
		throw new TypeError('error')
	}
	let args = Array.from(arguments)
	let context = args.shift()
	context = context ? context : window
	context.fn = this
	let result = null
	if (args.length === 0) {
		result = context.fn()
	} else {
		result = context.fn(...args)
	}
	delete context.fn
	return result
}
