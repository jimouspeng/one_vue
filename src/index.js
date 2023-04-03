/** vue
 * 响应式系统
 * 渲染器：将虚拟dom渲染为真实dom
 */

import { createRenderer } from './renderer';
import './reactivity';

const vnode = {
    tag: 'div',
    props: {
        onclick: () => console.log('渲染了'),
    },
    children: 'click me',
};

const MyComponent = {
    render() {
        return {
            tag: 'div',
            props: {
                onclick: () => console.log('hello, i am a component ~'),
            },
            children: 'a component ~~~',
        };
    },
};

const acomponent = {
    tag: MyComponent,
};

const createApp = (...arg) => {
    try {
        const app = createRenderer().createApp(...arg);
        return app;
    } catch (err) {
        console.log(err);
    }
};

const App = createApp(acomponent);

App.mount(document.body);


