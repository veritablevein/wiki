const PENDING = 'pending'
const FULLFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
    constructor(execute) {
        try {
            execute(this.resolve, this.reject)
        } catch (e) {
            console.log(e)
        }
    }

    state = PENDING
    value = undefined
    reason = undefined
    onFulfilledCallbacks = []
    onRejectedCallbacks = []

    resolve = value => {
        if (!this.state === PENDING) return;
        this.state = FULLFILLED
        this.value = value
        while (this.onFulfilledCallbacks.length) this.onFulfilledCallbacks.shift()()
    }

    reject = reason => {
        if (!this.state === PENDING) return;
        this.state = REJECTED
        this.reason = reason
        while (this.onRejectedCallbacks.length) this.onRejectedCallbacks.shift()()
    }

    then = (onFulfilled, onRejected) => {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason
        };

        let promise2 = new MyPromise((resolve, reject) => {
            if (this.state === FULLFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else if (this.state === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
            }
        })
        return promise2
    }
    finally(callback) {
        return this.then(value => {
            return MyPromise.resolve(callback()).then(() => value)
        }, reason => {
            return MyPromise.resolve(callback()).then(() => {
                throw reason
            })
        })
    } catch (onRejected) {
        return this.then(undefined, onRejected)
    }

    static resolve(value) {
        if (value instanceof MyPromise) return value
        return new MyPromise(resolve => resolve(value))
    }
    static all(array) {
        let result = []
        let index = 0

        return new MyPromise((resolve, reject) => {
            function addData(key, value) {
                result[key] = value
                index++
                if (index === array.length) {
                    return resolve(result)
                }
            }

            for (let key in array) {
                let current = array[key]
                if (current instanceof MyPromise) {
                    current.then(value => addData(key, value), reason => reject(reason))
                } else {
                    addData(key, array[key])
                }
            }
        })
    }
}

const resolvePromise = (promise2, x, resolve, reject) => {
    if (promise2 === x) return reject(new TypeError('Chaining cycle detected for promise'))
    let called
    if ((typeof x === 'object' && x != null) || typeof x === 'function') {
        try {
            let then = x.then
            if (typeof then === 'function') {
                then.call(x, y => {
                    if (called) return
                    called = true
                    resolvePromise(promise2, y, resolve, reject)
                }, r => {
                    if (called) return
                    called = true
                    reject(r)
                })
            } else {
                resolve(x)
            }
        } catch (e) {
            if (called) return
            called = true
            reject(e)
        }
    }else{
        resolve(x)
    }
}

MyPromise.defer = MyPromise.deferred = function () {
    let dfd = {}
    dfd.promise = new MyPromise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}

module.exports = MyPromise