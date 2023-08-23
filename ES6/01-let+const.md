# let&const

## 1. let

### 块级作用域

依然可以声明函数

### 不存在变量提升

### 暂时性死区

### 不允许重复声明

## 2. const

### 常量

准确的说，内存地址中数据不允许变动

```javascript
const foo = Object.freeze({});// 真正的冻结对象
```

### 无变量提升

### 暂时性死区

## 3. 顶层对象

### let const class声明的全局变量不再属于顶层对象的属性

### globalThis(ES2020)

浏览器 --- window --- Node和Web Worker中没有window

浏览器和Web Worker --- self指向顶层对象 --- Node中没有self

Node.js --- global

现在globalThis可以直接拿到顶层对象的this

```javascript
var getGlobal = function () {//在之前必须如此才行
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};
```
