let originArray = [1, 2, 3]

// const proxyTarget = createReactive(originArray)
// proxyTarget[3] = 4
// console.log(originArray === proxyTarget) // false

const reactiveMap = new Map()
function createReactive(raw) {
    return new Proxy(raw, {
        get(target, key, receiver) {
            console.log(target, key, 'get----')
            if (typeof target[key] === 'object') {
                console.log('是对象')
                if (reactiveMap.has(target[key])) {
                    return reactiveMap.get(target[key])
                }
                const proxyVal = createReactive(target[key])
                reactiveMap.set(target[key], proxyVal)
                return proxyVal
            }
            return Reflect.get(target, key, receiver)
        },
        set(target, key, value) {
            console.log(target.length, key, value, 'set----')
            const res = Reflect.set(target, key, value)
            return res
        },
    })
}
const obj = {}
const arr = createReactive([obj])
console.log(arr.includes(arr[0]), arr.includes(obj))
