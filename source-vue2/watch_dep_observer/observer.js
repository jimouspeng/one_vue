/** Observer响应式类，职责：
 * 构造响应式数据
 */

import Dep from './dep.js'

export const hasProto = '__proto__' in {}

class Observer {
    constructor(value, shallow = false) {
        /** 构造dep类，监听属性变化，收集依赖 */
        this.dep = new Dep()
        /** 将数据关联到__ob__上面 */
        def(vlaue, '__ob__', this)
        if (isArray(value)) {
            if (!mock) {
                if (hasProto) {
                    value.__proto__ = arrayMethods
                } else {
                    for (let i = 0, l = arrayKeys.length; i < l; i++) {
                        const key = arrayKeys[i]
                        def(value, key, arrayMethods[key])
                    }
                }
            }
            if (!shallow) {
                this.observeArray(value)
            }
        } else {
            /** 对对象的监听 */
            const keys = Object.keys(value)
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i]
                defineReactive(value, key)
            }
        }
    }
    /** 监听数组 */
    observerArray(value) {
        for (let i = 0; i < value.length; i++) {
            observe(value[i], false)
        }
    }
}

export function def(obj, key, val, enumerable /** boolean类型 */) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true,
    })
}

export function observe(value, shallow, ssrMockReactivity) {
    if (value && hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        /** 说明已经是响应式对象 */
        return value.__ob__
    }
    if (shouldObserve && (ssrMockReactivity || !isServerRendering()) && (isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value.__v_skip /* ReactiveFlags.SKIP */ && !isRef(value) && !(value instanceof VNode)) {
        return new Observer(value, shallow, ssrMockReactivity)
    }
}

/** 双向数据绑定的核心实现api */
export function defineReactive(obj, key, val, customSetter, shallow, mock) {
    const dep = new Dep()
    const property = Object.getOwnPropertyDescriptor(obj, key)
    if (property && property.configurable === false) {
        /** 无法自定义属性，那么就无法构造响应式数据 */
        return
    }
    // cater for pre-defined getter/setters
    const getter = property && property.get
    const setter = property && property.set
    if ((!getter || setter) && (val === NO_INITIAL_VALUE || arguments.length === 2)) {
        val = obj[key]
    }
    let childOb = !shallow && observe(val, false, mock)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val
            if (Dep.target) {
                dep.depend()
                if (childOb) {
                    childOb.dep.depend()
                    if (isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return isRef(value) && !shallow ? value.value : value
        },
        set: function reactiveSetter(newVal) {
            const value = getter ? getter.call(obj) : val
            if (!hasChanged(value, newVal)) {
                return
            }
            if (__DEV__ && customSetter) {
                customSetter()
            }
            if (setter) {
                setter.call(obj, newVal)
            } else if (getter) {
                // #7981: for accessor properties without setter
                return
            } else if (!shallow && isRef(value) && !isRef(newVal)) {
                value.value = newVal
                return
            } else {
                val = newVal
            }
            childOb = !shallow && observe(newVal, false, mock)
            if (__DEV__) {
                dep.notify({
                    type: TriggerOpTypes.SET,
                    target: obj,
                    key,
                    newValue: newVal,
                    oldValue: value,
                })
            } else {
                dep.notify()
            }
        },
    })

    return dep
}
