function deepCopy(obj) {
	if (typeof obj !== 'object' || obj == null) {
		// 非引用类型直接返回
		return obj
	}

	let result
	if (obj instanceof Array) {
		// 是数组
		result = []
	} else {
		result = {}
	}
	for (let key of Object.keys(obj)) {
		// Object.keys不会迭代到原型链上的属性
		result[key] = deepCopy(obj[key])
	}
	return result
}

let obj1 = [1, 2, 3]
let obj2 = {
	a: 1,
	b: [1, 2, 3],
	c: {
		d: 1,
		e: [1, 2, 3],
		f: { k: 'str' }
	}
}
console.log(deepCopy(obj2))
