/** Reflect */

let userInfo = {
    _age: 1,
    name: '111',
    get age() {
        return this._age
    },
} // console.log(userInfo._age)
// console.log(Reflect.get(userInfo, 'age', { _age: 2 }))
let proxyTarget = new Proxy(userInfo, {
    get(target, key) {
        // console.log(target[key])
        console.log('？？？')
        return target[key]
        // return Reflect.get(target, key, receiver)
    },
})

console.log(proxyTarget.age)

// Object.defineProperty(userInfo, 'age', {
//     get: () => {
//         console.log('触发了target-get')
//         return 1
//     },
//     enumerable: true,
//     configurable: true,
// })

Object.defineProperty(proxyTarget, '_age', {
    get: () => {
        console.log('触发了proxytarget-get')
        // return 1
        // return userInfo.age
    },
    set: (val) => {
        console.log(val)
    },
})

// console.log(userInfo.age)
