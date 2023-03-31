/** 渲染器 */

// import { renderer } from './renderer.js';
import { createAppAPI } from './apiCreateApp.js';

export function createRenderer() {
    /** n1: 旧虚拟dom   n2:新虚拟dom  container: 根节点 */
    const patch = (n1, n2, container) => {
        if (typeof n2.tag === 'string') {
            // 标签元素渲染
            mountElement(n2, container);
        } else if (typeof n2.tag === 'object') {
            // 组件渲染
            processComponent(n1, n2, container);
        }
    };
    /** 标签元素挂载 */
    const mountElement = (vnode, container) => {
        const el = document.createElement(vnode.tag);
        // 遍历所有props
        for (const key in vnode.props) {
            if (/^on/.test(key)) {
                // 以on开头的事件注册
                el.addEventListener(key.substring(2).toLowerCase(), vnode.props[key]);
            }
        }
        if (typeof vnode.children === 'string') {
            el.appendChild(document.createTextNode(vnode.children));
        } else if (Array.isArray(vnode.children)) {
            vnode.children.forEach((child) => patch(child, el));
        }
        container.innerHtml = '';
        container.appendChild(el, document.body);
    };
    /** 处理组件节点 */
    const processComponent = (n1, n2, container) => {
        // 获取虚拟dom树
        if (n1 === null) {
            // 没有旧虚拟dom，说明是挂载组件
            mountComponent(n2, container);
        }
    };
    /** 组件挂载 */
    const mountComponent = (n2, container) => {
        const subtree = n2.tag.render();
        patch(null, subtree, container);
    };
    /** 渲染函数 */
    const render = (vnode, container) => {
        if (vnode == null) {
            if (container._vnode) {
                // unmount(container._vnode, null, null, true);
            }
        } else {
            patch(container._vnode || null, vnode, container);
        }
        // flushPostFlushCbs();  vue在这里刷新了组件更新队列
        container._vnode = vnode;
    };
    return {
        render,
        createApp: createAppAPI(render),
    };
}
