/** vue2的数据劫持-核心实现 */

/** 前置调用：
 * 1. vue初始化(new Vue调用)，执行_init方法；
 * 2. 在initData阶段，完成实例.key对data数据操作的映射，并调用Observer类完成对数据变更的监听；
 */
export function defineReactive(obj, key, val, customSetter, shallow, mock) {
    /** initData阶段，实例化Dep类 */
    const dep = new Dep()
    const property = Object.getOwnPropertyDescriptor(obj, key)
    if (property && property.configurable === false) {
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
                if (__DEV__) {
                    dep.depend({
                        target: obj,
                        type: TrackOpTypes.GET,
                        key,
                    })
                } else {
                    dep.depend()
                }
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
