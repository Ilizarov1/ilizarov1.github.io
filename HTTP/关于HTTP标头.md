# 常见HTTP请求头

[HTTP头字段 - 维基百科，自由的百科全书 (wikipedia.org)](https://zh.wikipedia.org/wiki/HTTP头字段#请求字段)

- Accept-*：能够接受的响应格式

- Authorization：认证字段，举例AWS4-xxxx; token=xxx

- Cache-Control：缓存控制相关

- Connection：连接类型

- Cookie：在 set-cookie之后

- Content-*：请求体信息

- Date：日期

- Host：主机

- If-Match： 仅当客户端提供的实体与服务器上对应的实体相匹配时，才进行对应的操作，举例PUT：上次修改以来没有发生更改，相匹配才更新

- If-Modified-Since

- If-None-Match：缓存相关，允许在对应的内容未被修改的情况下返回304未修改

- If-Range：如果该实体未被修改过，则向我发送我所缺少的那一个或多个部分；否则，发送整个新的实体

- If-Unmodified-Since：仅当该实体自某个特定时间已来未被修改的情况下，才发送回应。

- Origin: 发起一个针对 跨来源资源共享 的请求（要求服务器在回应中加入一个‘访问控制-允许来源’（'Access-Control-Allow-Origin'）字段）。

- Range:仅请求某个实体的一部分。

- Referer: 表示浏览器所访问的前一个页面，正是那个页面上的某个链接将浏览器带到了当前所请求的这个页面。

- User-Agent：浏览器的浏览器身份标识字符串

# 常见响应头

- Access-Control-Allow-Origin：指定哪些网站可参与到跨来源资源共享过程中
- Accept-*：指定服务器能够接受的类型、范围
- Cache-Control：向从服务器直到客户端在内的所有缓存机制告知，它们是否可以缓存这个对象。其单位为秒
- Content-*：消息体相关信息
- ETag：对于某个资源的某个特定版本的一个标识符，通常是一个 消息散列
- Expires：指定一个日期/时间，超过该时间则认为此回应已经过期
- Last-Modified：所请求的对象的最后修改日期(按照 RFC 7231 中定义的“超文本传输协议日期”格式来表示)
- Set-Cookie