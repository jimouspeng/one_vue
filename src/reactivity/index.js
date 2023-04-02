/** 响应系统 */
import { reactive } from './reactive.js'
import { effect } from './effect.js'

const obj = reactive({ text: 'hello world', name: 'jimous', age: 26 })

function htmlupdate() {
    document.body.innerHTML = ''
    const el = document.createElement('div')
    el.innerText = 'my doctor' + obj.age
    document.body.appendChild(el)
}

let a, b

// 嵌套effct副作用函数，需要处理activeEffect的覆盖问题
effect(update)

function update() {
    console.log('副作用函数update执行@@@')
    effect(update2)
    a = obj.text
}

function update2() {
    /** 嵌套的++ 一直被get收集，然后++赋值操作的时候，又再次触发get时候收集的effect函数，循环调用 */
    obj.age++ // -> obj.age = obj.age + 1
    console.log('副作用函数update2执行@@@')
}
// effect(update2)

setTimeout(() => {
    obj.text = 1
    // obj.age++
    // setTimeout(() => {
    //     obj.name = 'jimous is cool';
    // }, 2000);
    // obj.age = +1;
}, 2000)

// console.log(obj.text, 'kankan text');
