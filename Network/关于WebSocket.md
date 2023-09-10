# 关于 WebSocket

一种基于TCP的全双工的通信协议

[WebSocket：5分钟从入门到精通 - 掘金 (juejin.cn)](https://juejin.cn/post/6844903544978407431?searchId=20230908192608A40C7DD809B5C1FAD789#heading-5)

## 优点

- 全双工，实时性更强
- 控制开销比较少，头部数据少
- 支持扩展

## 缺点

- 连接状态需要手动维持，断线不能自动重连，需要自己实现心跳保持

## 如何建立连接

- 复用HTTP握手通道

1. 客户端发起协议升级请求，GET connection: upgrade ; upgrade: websocket
2. 服务端响应，状态码101：切换协议

## Sec-WebSocket-Key/Accept的作用

防止恶意连接和意外连接，并不能保证安全

- 避免非法websocket

- 确保服务端是能够理解 websocket的

- 防止意外的协议请求，（sec-websocket-key及相关头部是禁止手动设置的）

- 防止代理缓存连接请求（意外连接

  