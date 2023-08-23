// 指定时间内，仅一次触发，用于控制事件触发频率
function throttle(fn, delay) {
	let preTime = Date.now
	return function () {
		let args = Array.from(arguments)
		nowTime = Date.now
		if (nowTime - preTime >= delay) {
			preTime = Date.now
			return fn.apply(this, args)
		}
	}
}
