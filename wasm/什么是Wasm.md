# WASM论文阅读笔记

[Bringing the web up to speed with WebAssembly | Proceedings of the 38th ACM SIGPLAN Conference on Programming Language Design and Implementation](https://dl.acm.org/doi/10.1145/3062341.3062363)

# WASM背景介绍

- JS 是网络上上唯一被原生支持的编译语言
- WEB 应用越来越复杂，效率和安全问题凸显

## 1. 曾经的低级代码尝试

- ActiveX：代码签名技术，不安全，完全依靠信任
- Native Client：沙盒技术，浏览器限制不能访问JS和WEB API，且不可移植
- Emscripten：asm.js技术前身
- asm.js：静态汇编语言，通过额外的强制类型和过程间不变量的模块机验证避开JS的动态类型系统，实际上是JS的一个子集，功能的扩展完全依赖于JS的扩展，即使JS扩展可能也不能奏效。

上述技术，均无法实现，安全、快速、可移植的目标

