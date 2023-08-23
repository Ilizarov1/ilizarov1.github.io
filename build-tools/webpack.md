# webpack

详细入门：https://juejin.cn/post/7023242274876162084

面试题：https://juejin.cn/post/6844904094281236487

[学习 Webpack5 之路（基础篇） - 掘金 (juejin.cn)](https://juejin.cn/post/6991630925792542750)

## 介绍下 webpack

是一个js应用程序模块打包器，打包时会递归的创建一个依赖关系图，包含应用的每个模块，然后将这些模块打包成一个或多个包。

## 有哪些配置

- 入口
- 输出
- loader
- plugin
- mode
- resolve
- optimization

## loader

webpack 本身是只有js和json文件的打包构建能力，而其他文件的打包构建需要 loader 去识别去编译处理，转化为模块

### 常用模块

css : style-loader / css-loader / less-loader / postcss-loader

ts: ts-loader / esbuild-loader

## plugin

用来扩展 webpack 本身能力的，比如 对打包过程进行分析，对包体积分析，提取css文件到独立包，之类的。

### 常用plugin

打包完需要一个h5文件引入所有的包，html-webpack-plugin

编译速度分析：speed-measure-webpack-plugin

包体积分析：webpack-bundle-analyzer



## resolve

用来设置模块如何解析，比如设置模块别名，引入某些模块可以不写后缀之类的

## optimization

用于定义 webpack 内置优化项，比如，要不要压缩，压缩用什么插件，拆分包，要不要用缓存，之类的

## 如何优化

一个是优化构建速度，一个是优化打包体积

### 优化构建速度

- 多进程构建 thread-loader
- 配置 webpack 缓存，cache: filesystem
- 减少不必要的loader
- 指定 loader 应用范围，include / exclude
- 优化 resolve，控制解析范围，extensions / modules
- 区分构建环境，比如生产环境就不需要 source-map 、dev-server之类的功能了

### 减少打包体积

压缩代码

抽离公共代码：把代码分离到不同的bundle，获取到更小的bundle，然后就可以按需加载或者并行加载这个bundle

tree shaking：移除未引用的代码

- 压缩 js，terser -webpack-plugin
- 压缩 css，cssMinimizer-webpack-plugin
- 抽离公共代码，splitChunksPlugin
- 抽离css，mini-css-extract-plugin
- usedExports / sideEffects

## Tree-Shaking 的原理

- 实质就是移除没有引用的代码
- 配合 usedExports 和 sideEffects
- 当我们设置了 usedExports = true 并启动了 webpack的优化选项，比如 terser后
- webpack 会为每个模块内的代码进行静态分析，为引用的代码会被标记为 unused
- 之后 terser 会在优化时把这些未引用的部分移除
- 而 package.json 文件中的 sideEffects 选项告诉webpack 某些文件和模块具有副作用，不进行标记

