/** const p = new Proxy(target, handler)
 *  @target 要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）
 *  @hadnler 以函数作为属性的对象，包含proxy的各个捕获器(trap)
 */
let userInfo = {
    _age: 12,
    get age() {
        return this._age
    },
}

var proxyUserInfo = new Proxy(userInfo, {
    get(target, key, receiver) {
        return target[key]
        // return Reflect.get(target, key, receiver)
    },
    set(target, key, value) {
        Reflect.set(target, key, value)
    },
})

proxyUserInfo.age = 2 // 无效

Object.defineProperty(userInfo, 'age', {
    get() {
        return 999 // 有效
    },
})

Object.defineProperty(proxyUserInfo, 'age', {
    get() {
        return 666 // 有效
    },
})

console.log('====================================')
console.log(proxyUserInfo.age, userInfo.age)
console.log('====================================')
