/** vue调度函数队列 */

const queue = [];
let isFlushing = false;
let flushIndex = 0;
let resolvedPromise = Promise.resolve();
let currentFlushPromise;

// function queueFlush() {
//     if (!isFlushing && !isFlushPending) {
//         isFlushPending = true;
//         currentFlushPromise = resolvedPromise.then(flushJobs);
//     }
// }

export function nextTick(fn) {
    const p = currentFlushPromise || resolvedPromise;
    return fn ? p.then(this ? fn.bind(this) : fn) : p;
}

export function flushPreFlushCbs(seen, i = isFlushing ? flushIndex + 1 : 0) {
    for (; i < queue.length; i++) {
        const cb = queue[i];
        if (cb && cb.pre) {
            queue.splice(i, 1);
            i--;
            cb();
        }
    }
}
