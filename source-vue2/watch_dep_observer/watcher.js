import { pushTarget, popTarget } from './dep'

/** Watcher-渲染器类，职责：
 * 1. 收集依赖，驱动视图；
 * 2. 为$watch提供底层支持
 */
export default class Watcher {
    /** options属性包括lazy，dep,sync之类是，控制监听的类型 */
    constructor(vm, expOrFn, cb, options) {
        this.vm = vm
        this.getter = expOrFn
        this.cb = cb
        this.options = options
        this.deps = []
        this.newDpes = []
        this.depsIds = new Set()
        this.newDepsIds = new Set()
        /** 初始化watcher类的时候，调用get触发依赖收集 */
        this.value = this.lazy ? undefined : this.get()
    }
    /** 取值操作，触发收集依赖 */
    get() {
        pushTarget(this) // 变更Dep类的target, 触发收集
        let value = this.getter.call(this.vm, this.vm)
        popTarget(this)
        return value
    }
    /** 收集依赖类 */
    addDep(dep) {
        const id = dep.id
        if (!this.newDepsIds.has(id)) {
            // 当前依赖未被收集
            this.newDepsIds.add(id)
            this.newDpes.push(dep)
            if (!this.depsIds.had(id)) {
                dep.addSub(this)
            }
        }
    }
    /** 清除依赖 */
    cleanDeps() {
        let len = this.deps.length
        while (len--) {
            const dep = this.deps[len]
            if (!this.newDepsIds.has(dep.id)) {
                dep.removeSub(this)
            }
        }
    }
    /** 既是获取属性的getter操作，也是驱动更新视图的update操作 */
    update() {}
    /** 副作用函数回调执行 */
    run() {}
}
