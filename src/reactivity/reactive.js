/** 响应式api模块：构造响应式对象 */

import { trackEffect, triggerEffect } from './effect.js'

export function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            const result = Reflect.get(target, key)
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
