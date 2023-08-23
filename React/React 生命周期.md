# React 生命周期

https://zh-hans.reactjs.org/docs/react-component.html

## 1. 三个常用

- ComponentDidMount

- ComponentDidUpdate

- ComponentWillUnmout

<img title="" src="React%20生命周期/2022-04-10-22-54-50-image.png" alt="" data-align="inline" width="692">

## 2. 三个不常用的

- static getDerivedStateFromProps ：唯一目的，使 State 随 props 变化，应用场景（state在任何时候都与props相同）

- getSnapshotBeforeUpdate：在render之后，更新DOM之前，从DOM中捕获信息，返回值会作为componentDidUpdate的第三个参数

- shouldComponentUpdate：根据 `shouldComponentUpdate()` 的返回值，判断 React 组件的输出是否受当前 state 或 props 更改的影响。首次渲染或使用 `forceUpdate()` 时不会调用该方法。

![](React%20生命周期/2022-04-10-23-22-48-image.png)

## 3. 相关知识点

- React.PureComponent：与 React.Component的区别是，PureComponent以浅层比较方式实现了shouldComponentUpdate，在组件使用相同 state 和 props 情况下可以提高性能

- 受控组件与非受控组件：受控指组件受到 props 影响和控制，非受控指组件仅含有 state [Controlled and uncontrolled form inputs in React don't have to be complicated - Gosha Arinich (goshacmd.com)](https://goshacmd.com/controlled-vs-uncontrolled-inputs-react/)

- component.forceUpdate(callback)：强制组件刷新。如果 `render()` 方法依赖于其他数据，则可以调用 `forceUpdate()` 强制让组件重新渲染。[React.Component – React (reactjs.org)](https://zh-hans.reactjs.org/docs/react-component.html#forceupdate)
