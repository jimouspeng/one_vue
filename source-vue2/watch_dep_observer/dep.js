/** Dep-依赖收集类，职责：
 *
 * Dep ->  Watcher实例  ->  update/getter函数
 *
 * Dep.target：
 * 在Vue3对应的是副作用调用栈，即effectStack,指向的是当前触发收集依赖的属性所在作用的函数；
 * 在Vue3是副作用函数的执行函数；在Vue2中是Watcher类
 */
let uid = 0

export default class Dep {
    static target = null
    constructor() {
        this.id = uid++
        /** subs: 订阅列表 */
        this.subs = []
    }
    /** 收集依赖 */
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }
    /** 触发依赖 */
    notify() {
        for (let i = 0; i < this.subs.length; i++) {
            this.subs[i].update()
        }
    }
    /** 增加订阅 */
    addSub(sub) {
        this.subs.push(sub)
    }
    /** 移除订阅 */
    removeSub(sub) {
        // 移除订阅的操作简单粗暴，直接置为null
        this.subs[this.subs.indexOf(sub)] = null
    }
}

Dep.target = null

export function pushTarget(target) {
    targetStack.push(target)
    Dep.target = target
}

export function popTarget(target) {
    targetStack.pop()
    Dep.target = targetStack[targetStack.length - 1]
}
