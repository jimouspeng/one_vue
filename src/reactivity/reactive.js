/** 响应式api模块：构造响应式对象 */

import { trackEffect, triggerEffect } from './effect-old.js'

export function reactive(raw) {
    return new Proxy(raw, {
        get(target, key, receiver) {
            // receiver指向的是proxy对象，保证对于原生target的getter函数内部的this,是指向proxy对象的
            /** 比如  target { get name(){ return this._name}}; 
             * 当对proxyTarget.name取值时，保证调用的getter函数返回的是proxyTarget.name,即this指向proxyTarget;
             * 因此需要Reflect接受receiver参数来确保this指向proxy对象，从而保证对proxyTarget的属性取值能触发get，完成依赖收集；
             * 如果直接返回target[key],那么对于存在属性访问器getter的对象，则无法完成依赖收集
             */

            const result = Reflect.get(target, key, receiver)
            trackEffect(target, key)
            return result
        },
        set(target, key, value) {
            const result = Reflect.set(target, key, value)
            triggerEffect(target, key)
            return result
        },
    })
}
