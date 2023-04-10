/** Object.defineProperty(obj, prop, descriptor)
 *  @obj 要定义属性的对象
 *  @prop 要定义或修改的属性的名称或 Symbol
 *  @descriptor 要定义或修改的属性描述符
 *  @return 被传递给函数的对象
 */
let userInfo = {}
Object.defineProperty(userInfo, 'age', {
    // configurable: false,
    configurable: true,
    enumerable: true,
    writable: false,
    value: 1,
})

try {
    Object.defineProperty(userInfo, 'age', {
        writable: true,
    })
} catch (err) {
    // 当初始化定义age的configurable为false时，重新定义触发err: Cannot redefine property: age
    console.log('defineProperty：', err)
}

try {
    userInfo.age = 2
} catch (err) {
    // 当初始化定义age的writable为false时，重新赋值不会报错，但是不会生效
    console.log(err)
}

Object.defineProperty(userInfo, 'age', {
    /** 当同时存在value,get时，会报错:Cannot both specify accessors and a value or writable attribute */
    // value: 29,
    get() {
        return 27
    },
    set(val) {
        /** 当变更userInfo.age, 触发set */
        console.log('set:', val)
    },
})

userInfo.age = 9

let userList = ['xiaoming', 'xiaohu']

// Object.defineProperty(userList, 'length', {
//     get() {
//         console.log('触发get')
//     },
// })

// console.log(userList, Object.getOwnPropertyDescriptors([]))

const methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

// console.log(arrayMethods, Object.getOwnPropertyNames(arrayMethods), 'hjahah')

const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)
let nameList = ['xiaoming', 'xiaohu']

// #__proto__原型绑定
Object.defineProperty(arrayMethods, 'push', {
    value: function pushMethods(...arg) {
        // #执行原生方法更新数据
        arrayProto['push'].apply(nameList, arg)
        console.log(arg, '执行了112', nameList)
    },
    enumerable: true,
    writable: true,
    configurable: true,
})
// nameList.__proto__ = arrayMethods

// #直接添加方法
// Object.defineProperty(nameList, 'push', {
//     value: arrayMethods['push'],
//     enumerable: true,
//     writable: true,
//     configurable: true,
// })

nameList.push('hah')
