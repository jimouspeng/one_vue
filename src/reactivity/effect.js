/** 依赖收集系统
 * 包括：
 * 提供依赖收集函数
 * 提供依赖触发函数
 * 清空依赖
 *
 * 为什么使用WeakMap来保存组件实例与其响应式属性之间的依赖关系：
 * WeakMap的键是弱引用，当组件实例被销毁时，对应的键值对会自动被垃圾回收，从而避免了内存泄漏问题
 *
 * 为什么使用Map数据结构来保存每个响应式属性的依赖项：
 * 可以确保在依赖仍然存在时保留依赖关系，避免了依赖被意外回收的问题，所以没有使用weakMap;
 * 同时，由于Map数据结构可以迭代其所有的键，这使得Vue 3可以在更新组件时有效地遍历依赖列表，从而避免了Vue 2中的性能问题;
 * 组件卸载时，依赖关系也会被清除,因此并不会导致内存泄漏问题
 *
 * 使用了Set数据结构来去重依赖项
 */

export let activeEffect; // 用于激活依赖收集的副作用函数
let effectStack = []; // 定义一个副作用函数调用栈, 解决effect嵌套调用导致activeEffect被内层effect函数调用时候覆盖
let targetMap = new WeakMap(); // 依赖对象收集存储桶

// class Dep {
//     constructor() {
//         this.deps = new Set();
//     }
//     add() {
//         this.deps.add(activeEffect);
//     }
// }

/** 通过effect函数收集副作用函数，激活activeEffect
 *  同时需要反向收集副作用关联的依赖集合, 当副作用每次被执行前，清空副作用的依赖项
 */
export function effect(fn) {
    const effectFn = () => {
        // 每次执行副作用函数前，清空历史依赖，保证每次收集的依赖都是最新有效的，
        // 比如三元表达式收集的属性依赖，存在再次执行副作用函数时，有些逻辑分支永远不会进入了：obj.text ? obj.name : 'hellow my doctor'; 当obj.text为false条件，.name的收集应该被回收
        cleanup(effectFn);
        // 当执行effectFn时，将其设置为当前激活的副作用函数
        activeEffect = effectFn;
        effectStack.push(effectFn); // 执行入栈
        fn();
        effectStack.pop(); // 内层副作用函数执行完毕出栈
        // 栈底存的是最外层副作用函数
        activeEffect = effectStack[effectStack.length - 1];
    };
    // 初始化deps属性
    effectFn.deps = [];
    effectFn();
}

function cleanup(effectfn) {
    for (let i = 0; i < effectfn.deps.length; i++) {
        let deps = effectfn.deps[i];
        deps.delete(effectfn);
    }
    effectfn.deps.length = 0;
}

/** 依赖收集函数，取决于activeEffect激活状态
 *
 * weakMap:
 *      ↓
 *     key: target  ->  value: map
 *                              ↓
 *                             key: target.key  ->   value: new set()
 *                                                               ↓
 *                                                 保存执行绑定当前响应式属性的副作用函数
 */
export function trackEffect(target, key) {
    if (!activeEffect) {
        return;
    }
    /** 从依赖收集桶里面找到当前操作的响应式对象的依赖 */
    let keyMap = targetMap.get(target);
    if (!keyMap) {
        // 如果不存在当前对象
        targetMap.set(target, (keyMap = new Map()));
    }
    let effectSet = keyMap.get(key);
    if (!effectSet) {
        keyMap.set(key, (effectSet = new Set()));
    }
    if (effectSet.has(activeEffect)) return;
    effectSet.add(activeEffect);
    activeEffect.deps.push(effectSet);
}

/** 依赖触发函数 */
export function triggerEffect(target, key) {
    // 执行依赖收集的副作用函数
    const keyMap = targetMap.get(target);
    if (!keyMap) return;
    const effectSet = keyMap.get(key);
    /** 这里通过forEach执行每个副作用时，由于副作用先被cleanup，然后又重新执行被收集了依赖，所以这里会一直循环下去
     *
     * forEach遍历set集合时，如果一个值已经被访问过，但该值被删除并重新添加到集合，如果此时foreach没有结束，那么该值会重新被访问
     */
    // const set = new Set([1]);
    // set.forEach((item) => {
    //     set.delete(1);
    //     set.add(1);
    //     console.log('set遍历');
    // });
    console.log(activeEffect, '触发了？', 'key');

    const effectsRunner = new Set();
    effectSet &&
        effectSet.forEach((effect) => {
            // 避免副作用函数执行++的时候，在++触发赋值操作触发set依赖执行，执行的副作用又因为++逻辑继续递归执行，导致无限循环
            // 此时的activeEffcet是最外层
            if (effect !== activeEffect) {
                effectsRunner.add(effect);
            }
        });
    effectsRunner.forEach((fn) => fn());
}
