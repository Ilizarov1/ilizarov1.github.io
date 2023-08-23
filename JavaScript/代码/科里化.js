// 一个函数带多个参数 = 》一系列仅使用一个参数的函数
function curry(fn, ...args) {
	if (typeof fn !== 'function') {
		throw new TypeError('type')
	}
	let length = fn.length
	if (args.length >= length) {
		return fn.call(null, ...args)
	} else {
		return curry.bind(null, fn, ...args)
	}
}

function add(a, b, c, d, e) {
	console.log([a, b, c, d, e])
}
const fn1 = curry(add, 1)
fn1(1)(1)(1)(1)
