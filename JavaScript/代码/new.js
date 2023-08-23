function myNew() {
	let newObject = null
	let args = Array.from(arguments)
	let constructor = args.shift()
	let result = null

	if (typeof constructor !== 'function') {
		console.error('typer error')
		return
	}

	// 根据原型创造原型副本
	newObject = Object.create(constructor.prototype)
	// 调用构造函数设置参数
	result = constructor.apply(newObject, args)

	// 构造函数有返回值就返回，没有就返回新对象
	return result ? result : newObject
}
function People(name, age) {
	this.name = name
	this.age = age
}
function Otaku2(name, age) {
	this.strength = 60
	this.age = age

	return function cb() {
		return {
			value: 1
		}
	}
}
console.log(new Otaku2('kevin', '18')) // function cb()
console.log(myNew(Otaku2, 'jnz', 18))
// let jnz = myNew(People, 'jnz', 18)
// let jnz2 = new People('jnz2', 18)
// console.log(jnz)
