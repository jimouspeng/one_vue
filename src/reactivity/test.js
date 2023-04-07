import { reactive } from './reactive.js'
import { effect } from './effect.js'

console.log('0999999999999')

let userInfo = reactive({
    _age: 1,
    name: '111',
    // proxy对象：get陷阱
    get age() {
        return this._age
    },
})

effect(() => {
    console.log(userInfo.age, '0000副作用函数执行')
})

userInfo._age = 2

console.log('1111')
