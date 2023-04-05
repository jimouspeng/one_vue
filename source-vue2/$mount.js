/** vue\src\platforms\web\runtime\index.js
 * vue2挂载函数，接受挂载的根节点以及注水(ssr渲染机制)标识hydrating
 * 调用mountComponent
 */
Vue.prototype.$mount = function (el, hydrating) {
    el = el && inBrowser ? query(el) : undefined
    return mountComponent(this, el, hydrating)
}

/** vue\src\core\instance\lifecycle.js
 * 组件挂载api
 */
export function mountComponent(vm, el, hydrating) {
    vm.$el = el
    if (!vm.$options.render) {
        vm.$options.render = createEmptyVNode
    }
    callHook(vm, 'beforeMount')
    let updateComponent
    updateComponent = () => {
        vm._update(vm._render(), hydrating)
    }
    // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined
    /** 在实例化Watcher的时候，调用了 */
    new Watcher(
        vm,
        updateComponent,
        noop,
        {
            before() {
                if (vm._isMounted && !vm._isDestroyed) {
                    callHook(vm, 'beforeUpdate')
                }
            },
        },
        true /* isRenderWatcher */
    )
    if (vm.$vnode == null) {
        vm._isMounted = true
        callHook(vm, 'mounted')
    }
    return vm
}
