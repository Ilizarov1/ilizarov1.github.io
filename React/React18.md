# React18 相关新特性

## 新的渲染 API

```js
ReactDOM.createRoot(root).render(<App />);
```

- 新的API支持并发渲染模式
- 取消了渲染回调函数，因为使用 Suspense 时通常不会有预期结果（可以通过 useEffect 实现效果
- 

## setState 自动批处理

- 18之前只在 React 事件中进行批处理，在promise setTimeout 原生事件中都不会进行批处理
- 现在任何情况都会进行批处理，多次更新合并为一次

### flushSync

可以使用 flushSync 管理批处理，在 flushSync 内部的 setState 会一起批处理

## 新的 hooks API

### useId

```js
const id = useId();
```

支持同一组件在客户端和服务端生成同一id

### useSyncExternalStore

用于解决外部数据撕裂问题（什么是外部数据撕裂？

- 外部数据撕裂（）：主要出现在第三方状态管理，react 并发更新模式，一次渲染会以 fiber 为单位分片进行，中间穿插高优先级更新，如果在高优先级中更改了公共的状态数据，那么之前完成的低优先级就必须要重新来过，否则会出现状态前后不一致问题。
- 原生 setState 解决了这个问题，但是第三方状态管理可能并不依赖 react setState ，而是在外部维护一个数据 store ，所以需要这个 api

### **useInsertionEffect**

- 原理与 useLayoutEffect 大致类似，但是此时无法访问 DOM 引用
- 用于 css in js 提前注入样式

## 并发渲染模式

通过渲染可中断的 fiber 架构，让 react 可以同时更新多个状态

### useTransition

```js
import React, { useState, useEffect, useTransition } from 'react';

const App: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    // 使用了并发特性，开启并发更新
    startTransition(() => {
      setList(new Array(10000).fill(null));
    });
  }, []);
  return (
    <>
      {list.map((_, i) => (
        <div key={i}>{i}</div>
      ))}
    </>
  );
};

export default App;
```

useTransition 返回了一个 startTransition 函数，在该函数回调内进行 setState 会被标记为低优先级更新，能够被高优先级更新抢占

### useDeferredValue

和 useTransition 一样标记低优先级，startTransition 用于标记低优先级的任务，useDeferredValue 用于标记低优先级的状态，标记后的状态在空闲时才会更新

## React Sever Component

### SSR CSR RSC 的区别

- CSR：服务端只发送最小化的HTML文件，通过JS 包创建VDOM并完成渲染
- SSR：服务端发送完整结构的HTML，通过JS 包创建 VDOM并完成渲染
- 这两种都需要依赖JS在客户端构建组件树，即使这个组件树在服务端已经存在
- RSC：服务端发送序列化的组件树到客户端，而客户端可以高效构建组件树，无需发送HTML和JS包

## Suspense

配合并发渲染，挂起等待数据时会转向其他任务

## Cache 、fetch

缓存，减少请求次数

