/** set数据结构的add,delete,size,has等操作，都是走的get拦截函数 */
const objSet = new Set([1, 2, 3])
const proxySet = new Proxy(objSet, {
    get(target, key, receiver) {
        console.log(target, key, 'get--')
        if (key === 'size') {
            // size是属性，内部有this指向引用，所以不能传入receiver，而是要将target传入,由size对象调用
            return Reflect.get(target, key, target)
        }
        // 将方法与原始对象数据 target 绑定后再返回调用
        return target[key].bind(target)
    },
})

// console.log(proxySet.size)

proxySet.add(4) // get拦截函数捕获的key是add,所以通过bind绑定了add的调用对象为原始target，这样保证能正确添加值

// proxySet.delete(1)
console.log(proxySet.has(1), '??')
