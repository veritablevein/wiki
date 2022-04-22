static resolve(value) {
	if (value instanceof MyPromise) return value
	return new MyPromise(resolve => resolve(value))
}