/**
 *
 * @param {function} render 接收render函数
 */
export function createAppAPI(render) {
    return function createApp(rootComponent) {
        const context = createAppContext();
        let isMounted = false;
        const app = (context.app = {
            _uid: null,
            _component: null,
            _props: null,
            _container: null,
            _context: null,
            _instance: null,
            version: null,
            get() {
                return context.config;
            },
            set() {},
            use(plugin, ...options) {
                plugin.install(app, ...options);
                return app;
            },
            mixin(mixin) {
                context.mixins.push(mixin);
                return app;
            },
            component(name, component) {
                if (!component) {
                    return context.components[name];
                }
                context.components[name] = component;
                return app;
            },
            directive(name, directive) {
                if (!directive) {
                    return context.directives[name];
                }
                context.directives[name] = directive;
                return app;
            },
            mount(rootContainer) {
                if (!isMounted) {
                    // const vnode = rootComponent.tag.render();
                    // vnode.appContext = context;
                    render(rootComponent, rootContainer);
                    isMounted = true;
                    // app._container = rootContainer;
                }
            },
            unmount() {
                if (isMounted) {
                    render(null, app._container);
                }
            },
            provide(key, value) {
                context.provides[key] = value;
                return app;
            },
        });
        return app;
    };
}

export function createAppContext() {
    return {
        app: null,
        config: {
            isNativeTag: false,
            performance: false,
            globalProperties: {},
            optionMergeStrategies: {},
            errorHandler: undefined,
            warnHandler: undefined,
            compilerOptions: {},
        },
        mixins: [],
        components: {},
        directives: {},
        provides: Object.create(null),
        optionsCache: new WeakMap(),
        propsCache: new WeakMap(),
        emitsCache: new WeakMap(),
    };
}
