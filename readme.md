## 基于rollup构建框架，手写实现vue

##### effect执行++，循环依赖触发set, get

++的本质是先取值，再赋值，eg: age++ -> age = age + 1;
当执行 age + 1 的时候,触发了属性的get,此时副作用函数被当前key依赖收集；
接着执行 age = age + 1; 触发属性的set，set会取出当前key收集的副作用函数执行，之前执行++的副作用函数在get阶段被收集，那么当遍历的副作用函数执行到age++时，就会产生循环调用

解决：
对于++操作触发的set, 当遍历取出副作用函数执行时，要过滤掉当前++所在作用域的副作用函数，防止++函数被执行后产生循环调用
遍历执行副作用函数时，判断是否匹配当前activeEffect，如果全等则过滤


##### effect嵌套调用，activeEffect被嵌套的内层effect赋值覆盖，导致外级的依赖收集的activeEffect是内层的副作用函数，变更外级依赖相关的属性，执行的内层的副作用函数

导致这个问题的本质是因为activeEffect只是一个通用的全局变量，赋值取值容易被覆盖

解决：
维护effectStack, 当执行effect时，会执行内部的执行函数effectFn, 执行时将当前effectFn赋值给activeEffect,接着执行真正的副作用函数，当副作用函数执行后，此时完成了依赖收集工作，再将activeEffect
从栈顶取出，并且重置activeEffect的值，初始值为undefined(只声明，未赋值),所以每次effect结束后，activeEffect都会被置为undefined状态。
`
export function effect(fn) {
    const effectFn = () => {
        // 每次执行副作用函数前，清空历史依赖，保证每次收集的依赖都是最新有效的，
        // 比如三元表达式收集的属性依赖，存在再次执行副作用函数时，有些逻辑分支永远不会进入了：obj.text ? obj.name : 'hellow my doctor'; 当obj.text为false条件，.name的收集应该被回收
        cleanup(effectFn);
        // 当执行effectFn时，将其设置为当前激活的副作用函数
        activeEffect = effectFn;
        effectStack.push(activeEffect); // 执行入栈
        fn();
        console.log('执行完毕？？', effectStack.length);
        effectStack.pop(); // 内层副作用函数执行完毕出栈
        // 栈底存的是最外层副作用函数
        activeEffect = effectStack[effectStack.length - 1];
    };
    // 初始化deps属性
    effectFn.deps = [];
    effectFn();
}
`


##### effect嵌套调用 + (内层effect执行++)，导致调用栈内存溢出
解决了单层effect执行++导致循环依赖，解决了effect嵌套导致依赖收集与副作用函数一致性问题，当effect嵌套遇上内层effect++, 无限依赖的问题又出现了

本质：首先完成第一次依赖收集时；
当触发外层依赖属性变更，导致外层依赖副作用函数触发：
1. 外层副作用函数执行，期间调用执行内层的effect，effect内部重新声明了一个effectFn,指向activeEffect
2. 执行该effectFn时，会执行effect函数接收的fn，该fn为++所在区域的内层依赖函数，先执行fn，此时执行++：
3. 首先触发get，在依赖收集期间，effect函数创建的effectFn被收集，同一个effect函数创建的effectFn并不相等, 即跟第一次依赖收集的++所在函数不相同，所以此时++所在effectFn的执行被收集；
4. 接着触发set，将++属性相关的副作用函数取出来执行，此时有一个++函数被再次执行，陷入循环。

举个例子：
`
const fn1 = () => {
    console.log('传入的副作用函数');
};
const fn2 = () => {
    console.log('传入的另一个副作用函数');
};
function effect(fn) {
    const effectFn = () => {
        let a = 1;
        fn();
        console.log(a);
    };
    return effectFn;
}
console.log(effect(fn1) === effect(fn1)); // false
console.log(effect(fn1) === effect(fn2)); // false
`