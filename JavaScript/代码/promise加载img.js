function loadImg(src) {
	const promise = new Promise((resolve, reject) => {
		const img = document.createElement('img')
		img.onload = () => {
			resolve(img)
		}
		img.onerror = () => {
			reject(new Error('failure'))
		}
		img.src = src
	})
	return promise
}
const url = 'http://127.0.0.1'
loadImg(url)
	.then((img) => {
		console.log(img)
	})
	.catch((ex) => console.log(ex))
