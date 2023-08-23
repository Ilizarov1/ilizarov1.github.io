Function.prototype.myBind = function () {
	const argLst = Array.from(arguments)
	const obj = argLst.shift()

	if (typeof this !== 'function') {
		throw new TypeError('error')
	}
	return () => this.apply(obj, argLst)
}
function fn1(a, b, c) {
	console.log('this', this)
	console.log(a, b, c)
	return 'this is fn1'
}
const fn2 = fn1.myBind({ x: 100 }, 10, 20, 30)
console.log(typeof fn2)
const res = fn2()
console.log(res)
