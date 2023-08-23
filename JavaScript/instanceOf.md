## instanceof 作用

- 判断对象原型是否在原型链上

## 实现一个instanceof

```js
function myInstanceof(instance, constructor) {
  let lProto = Object.getPrototypeOf(instance); // 获取原型
  let rProto = constructor.prototype; // 获取原型，为什么不能使用getPrototypeOf？
  // 因为constructor为构造函数，使用getPrototypeof会返回函数对象的原型
  // 即，getPrototypeOf(constructor) === Function.prototype
  while (lProto != null) {
    if (lProto === rProto) return true;
    lProto = Object.getPrototypeOf(lProto);
  }
  return false;
}
```
