/** map数据结构的add,delete,size,has等操作，都是走的get拦截函数 */
const objMap = new Map()
const proxyMap = new Proxy(objMap, {
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

// console.log(proxyMap.size)

proxyMap.set('name', 'jimous') // get拦截函数捕获的key是set,所以通过bind绑定了add的调用对象为原始target，这样保证能正确添加值

// proxyMap.delete(1)
console.log(proxyMap.size, '??')

const map1 = new Map([
    ['key1', 'value1'],
    ['key2', 'value2'],
])
for (const [key, value] of map1.entries()) {
    // for...of 循环本质上是读取迭代对象上的[Symbol.iterator]属性
    console.log(key, value)
}

const itr = map1[Symbol.iterator]()
console.log(itr.next())
console.log(itr.next())
