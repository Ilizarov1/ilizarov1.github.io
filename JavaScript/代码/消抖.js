// 指定时间内，产生多次请求，停止请求后再触发，用于防止多次请求
function debounce(method, wait) {
	if (typeof method !== 'function') {
		throw new TypeError('error')
	}
	let timer = null
	return function () {
		let args = Array.from(arguments)
		if (timer) {
			clearTimeout(timer)
			timer = null
		}

		timer = setTimeout(() => {
			method.apply(this, args)
		}, wait)
	}
}
