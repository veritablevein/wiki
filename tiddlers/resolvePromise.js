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