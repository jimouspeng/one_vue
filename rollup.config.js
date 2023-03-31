import babel from 'rollup-plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import RollupCommonjs from '@rollup/plugin-commonjs';
// import { terser } from 'rollup-plugin-terser';
// import MyPlugin from './rollup.plugin.js';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/bundle.js',
            /** globals: 创建iife | umd格式的bundle文件时，需要通过globals选项来提供全局变量名称，以替换外部引入 */
            // globals: {},
            /** format指定生成bundle.js格式
             * amd：异步模块定义，适用于requireJS等模块加载器
             * cjs：commonjs规范，适用于node环境以及其他打包工具
             * es：将bundle保留为es模块文件，适用于其他打包工具以及支持<script type=module>标签的浏览器，别名：esm,module
             * iife：自执行函数，适用于<script>标签
             * umd：通用模块定义，生成的包同时支持amd,cjs和iife三种格式
             * system：systemjs模块加载器的原生格式
             */
            format: 'umd',
            /** name：定义全局变量名来表示bundle的导出，输出格式必须指定为iife或者umd */
            name: 'OneVue',
        },
    ],
    /** plugins: 插件 */
    plugins: [
        RollupCommonjs(),
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true,
            externalHelpers: true,
        }),
        nodeResolve({
            browser: true,
        }),
        // MyPlugin(),
        // terser(),
    ],
};
