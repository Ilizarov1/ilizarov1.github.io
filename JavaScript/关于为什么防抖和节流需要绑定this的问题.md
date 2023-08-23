# 关于为什么防抖和节流需要绑定this的问题

## introduce

在防抖和节流中需要绑定this，形如：

```javascript
// 实现一个节流
// 节流是啥：一定时间内只能触发一次
function throttle(fn, duration) {
  let prev = 0;
  return function (...args) {
    const now = Date.now();
    if (duration - (now - prev) <= 0) {
      fn.apply(this, args);
      prev = Date.now();
    }
  };
}
// 实现一个防抖
// 防抖是啥：短时间内多次触发只触发最后一次
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

看起来有点多此一举，**为什么要绑定this呢？** 什么样的使用情况会需要这个this？

## answer

实际上，防抖也好节流也好，最大的应用情景就是事件处理的回调。

绑定这个this的最大原因就是为了保留事件触发对象的引用（currentTarget。

是为了让函数在事件触发中获得正确的调用上下文结果。

> ### [处理过程中 `this` 的值的问题](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#the_value_of_this_within_the_handler "Permalink to 处理过程中 this 的值的问题")
> 
> 通常来说this的值是触发事件的元素的引用，这种特性在多个相似的元素使用同一个通用事件监听器时非常让人满意。
> 
> 当使用 `addEventListener()` 为一个元素注册事件的时候，句柄里的 this 值是该元素的引用。其与传递给句柄的 event 参数的 `currentTarget 属性的值一样。`

```html
<body>
    <div id="abc">
      <div>abc</div>
    </div>
    <script>
      function throttle(fn, duration) {
        let prev = 0;
        return function (...args) {
          const now = Date.now();
          if (duration - (now - prev) <= 0) {
            fn.apply(this, args);
            prev = Date.now();
          }
        };
      }
      const el = document.getElementById('abc');

      function print() {
        console.log(this); 
      }

      el.addEventListener('click', throttle(print, 1000));
    </script>
  </body>
```

正确的结果如下所示：

![](关于为什么防抖和节流需要绑定this的问题/2022-04-09-17-33-53-image.png)

## 引发问题

### 节流和防抖返回的这个函数，是否可以使用箭头函数呢？

```javascript
      function throttle(fn, duration) {
        let prev = 0;
        return (...args) => {
          const now = Date.now();
          if (duration - (now - prev) <= 0) {
            fn.apply(this, args);
            prev = Date.now();
          }
        };
      }
```

答案是否定的，这里的this会指向window，为什么呢？

因为这里的this指向取决于谁调用了throttle，而调用throttle的一般就是全局。
