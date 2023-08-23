# Symbol

## 1. 基本

- ES6 引入了一种新的原始数据类型`Symbol`，表示独一无二的值。

- Symbol 值通过`Symbol`函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。

- `Symbol`函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。
  
  - ```js
    let s1 = Symbol('foo');
    let s2 = Symbol('bar');
    
    s1 // Symbol(foo)
    s2 // Symbol(bar)
    
    s1.toString() // "Symbol(foo)"
    s2.toString() // "Symbol(bar)"
    ```

- 如果 Symbol 的参数是一个对象，就会调用该对象的`toString`方法，将其转为字符串，然后才生成一个 Symbol 值。
  
  - ```js
    const obj = {
      toString() {
        return 'abc';
      }
    };
    const sym = Symbol(obj);
    sym // Symbol(abc)
    ```

- 注意，`Symbol`函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的`Symbol`函数的返回值是不相等的。
  
  - ```js
    // 没有参数的情况
    let s1 = Symbol();
    let s2 = Symbol();
    
    s1 === s2 // false
    
    // 有参数的情况
    let s1 = Symbol('foo');
    let s2 = Symbol('foo');
    
    s1 === s2 // false
    ```

- Symbol 值不能与其他类型的值进行运算(转换，会报错。
  
  - ```js
    let sym = Symbol('My symbol');
    
    "your symbol is " + sym
    // TypeError: can't convert symbol to string
    `your symbol is ${sym}`
    // TypeError: can't convert symbol to string
    ```

- Symbol 值也可以转为布尔值，但是不能转为数值。
  
  - ```js
    let sym = Symbol();
    Boolean(sym) // true
    !sym  // false
    
    if (sym) {
      // ...
    }
    
    Number(sym) // TypeError
    sym + 2 // TypeError
    ```

## 2. description

[ES2019](https://github.com/tc39/proposal-Symbol-description) 提供了一个实例属性`description`，直接返回 Symbol 的描述。

```js
const sym = Symbol('foo');

sym.description // "foo"
```

## 3. 作为属性名

- 由于每一个 Symbol 值都是不相等的，这意味着 Symbol 值可以作为标识符，用于对象的属性名，就能**保证不会出现同名的属性**。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖。
  
  - ```js
    let mySymbol = Symbol();
    
    // 第一种写法
    let a = {};
    a[mySymbol] = 'Hello!';
    
    // 第二种写法
    let a = {
      [mySymbol]: 'Hello!'
    };
    
    // 第三种写法
    let a = {};
    Object.defineProperty(a, mySymbol, { value: 'Hello!' });
    
    // 以上写法都得到同样结果
    a[mySymbol] // "Hello!"
    ```
  
  - 注意，Symbol 值作为对象属性名时，不能用点运算符。
    
    - ```js
      const mySymbol = Symbol();
      const a = {};
      
      a.mySymbol = 'Hello!';
      a[mySymbol] // undefined
      a['mySymbol'] // "Hello!"
      ```
    
    - 因为点运算符后面总是字符串，所以不会读取`mySymbol`作为标识名所指代的那个值，导致`a`的属性名实际上是一个字符串，而不是一个 Symbol 值

- 在对象的内部，使用 Symbol 值定义属性时，Symbol 值必须放在方括号之中。
  
  - ```js
       let s = Symbol();
    
       let obj = {
         [s]: function (arg) { ... }
       };
    
       obj[s](123);
    ```

## 4. 消除魔术字符串

魔术字符串指的是，在代码之中多次出现、与代码形成强耦合的某一个具体的字符串或者数值。风格良好的代码，应该尽量消除魔术字符串，改由含义清晰的变量代替。

- ```javascript
  function getArea(shape, options) {
    let area = 0;
  
    switch (shape) {
      case 'Triangle': // 魔术字符串
        area = .5 * options.width * options.height;
        break;
      /* ... more code ... */
    }
  
    return area;
  }
  
  getArea('Triangle', { width: 100, height: 100 }); // 魔术字符串
  ```

- 上面代码中，字符串`Triangle`就是一个魔术字符串。它多次出现，与代码形成“强耦合”，不利于将来的修改和维护。

- 常用的消除魔术字符串的方法，就是把它写成一个变量。

- ```javascript
  const shapeType = {
    triangle: 'Triangle'
  };
  
  function getArea(shape, options) {
    let area = 0;
    switch (shape) {
      case shapeType.triangle:
        area = .5 * options.width * options.height;
        break;
    }
    return area;
  }
  
  getArea(shapeType.triangle, { width: 100, height: 100 });
  ```

- 如果仔细分析，可以发现`shapeType.triangle`等于哪个值并不重要，只要确保不会跟其他`shapeType`属性的值冲突即可。因此，这里就很适合改用 Symbol 值。

- ```javascript
  const shapeType = {
    triangle: Symbol()
  };
  ```

## 5. 属性名遍历

- Symbol 作为属性名，遍历对象的时候，该属性不会出现在`for...in`、`for...of`循环中，也不会被`Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()`返回。
  
  但是，它也不是私有属性，有一个`Object.getOwnPropertySymbols()`方法，可以获取指定对象的所有 Symbol 属性名。

- 另一个新的 API，`Reflect.ownKeys()`方法可以返回所有类型的键名，包括常规键名和 Symbol 键名。

- 由于以 Symbol 值作为键名，不会被常规方法遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。

## 6. Symbol.for() Symbol.keyfor()

- `Symbol.for()`方法可以做到这一点。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建一个以该字符串为名称的 Symbol 值，并将其注册到全局。
- 如果你调用`Symbol.for("cat")`30 次，每次都会返回同一个 Symbol 值，但是调用`Symbol("cat")`30 次，会返回 30 个不同的 Symbol 值。

# Set

ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

## 1. 数组去重

```javascript
// 去除数组的重复成员
[...new Set(array)]
//去除重复字符
[...new Set('ababbc')].join('')
// "abc"
```

## 2. 内部比较原理

Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（`===`），主要的区别是向 Set 加入值时认为`NaN`等于自身，而精确相等运算符认为`NaN`不等于自身。

```javascript
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN}
```

另外，两个对象总是不相等的。

```javascript
let set = new Set();

set.add({});
set.size // 1

set.add({});
set.size // 2
```

## 3. 实例属性和方法

Set 结构的实例有以下属性。

- `Set.prototype.constructor`：构造函数，默认就是`Set`函数。
- `Set.prototype.size`：返回`Set`实例的成员总数。

Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。下面先介绍四个操作方法。

- `Set.prototype.add(value)`：添加某个值，返回 Set 结构本身。
- `Set.prototype.delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
- `Set.prototype.has(value)`：返回一个布尔值，表示该值是否为`Set`的成员。
- `Set.prototype.clear()`：清除所有成员，没有返回值。

## 4. 遍历

- Set 结构的实例有四个遍历方法，可以用于遍历成员。
  
  - `Set.prototype.keys()`：返回键名的遍历器
  - `Set.prototype.values()`：返回键值的遍历器
  - `Set.prototype.entries()`：返回键值对的遍历器
  - `Set.prototype.forEach()`：使用回调函数遍历每个成员

- Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的`values`方法。
  
  - 这意味着，可以省略`values`方法，直接用`for...of`循环遍历 Set。
  
  - ```javascript
    let set = new Set(['red', 'green', 'blue']);
    
    for (let x of set) {
      console.log(x);
    }
    // red
    // green
    // blue
    ```

- 应用
  
  - 扩展运算符（`...`）内部使用`for...of`循环，所以也可以用于 Set 结构。
  
  - ```javascript
    let set = new Set(['red', 'green', 'blue']);
    let arr = [...set];
    // ['red', 'green', 'blue']
    ```
  
  - 数组的`map`和`filter`方法也可以间接用于 Set 了。
  
  - ```javascript
    let set = new Set([1, 2, 3]);
    set = new Set([...set].map(x => x * 2));
    // 返回Set结构：{2, 4, 6}
    
    let set = new Set([1, 2, 3, 4, 5]);
    set = new Set([...set].filter(x => (x % 2) == 0));
    // 返回Set结构：{2, 4}
    ```
  
  - 使用 Set 可以很容易地实现并集（Union）、交集（Intersect）和差集（Difference）。
  
  - ```javascript
    let a = new Set([1, 2, 3]);
    let b = new Set([4, 3, 2]);
    
    // 并集
    let union = new Set([...a, ...b]);
    // Set {1, 2, 3, 4}
    
    // 交集
    let intersect = new Set([...a].filter(x => b.has(x)));
    // set {2, 3}
    
    // （a 相对于 b 的）差集
    let difference = new Set([...a].filter(x => !b.has(x)));
    // Set {1}
    ```

# WeakSet

WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。

- 首先，WeakSet 的成员只能是对象，而不能是其他类型的值。

- 其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

# Map

## 1. 与对象区别

- JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。
  
  - ```javascript
    const data = {};
    const element = document.getElementById('myDiv');
    
    data[element] = 'metadata';
    data['[object HTMLDivElement]'] // "metadata"
    ```
  
  - 上面代码原意是将一个 DOM 节点作为对象`data`的键，但是由于对象只接受字符串作为键名，所以`element`被自动转为字符串`[object HTMLDivElement]`。

- ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，**但是“键”的范围不限于字符串**，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

- Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞（clash）的问题，我们扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。

- 如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键，比如`0`和`-0`就是一个键，布尔值`true`和字符串`true`则是两个不同的键。另外，`undefined`和`null`也是两个不同的键。虽然`NaN`不严格相等于自身，但 Map 将其视为同一个键。

## 2. 与其他类型转换

- **Map 转为数组**
  
  - 前面已经提过，Map 转为数组最方便的方法，就是使用扩展运算符（`...`）

- **数组 转为 Map**
  
  - 将数组传入 Map 构造函数，就可以转为 Map。

- **Map 转为对象**
  
  - 如果所有 Map 的键都是字符串，它可以无损地转为对象。
  
  - ```javascript
    function strMapToObj(strMap) {
      let obj = Object.create(null);
      for (let [k,v] of strMap) {
        obj[k] = v;
      }
      return obj;
    }
    
    const myMap = new Map()
      .set('yes', true)
      .set('no', false);
    strMapToObj(myMap)
    // { yes: true, no: false }
    ```

- **对象转为 Map**
  
  - ```javascript
    let obj = {"a":1, "b":2};
    let map = new Map(Object.entries(obj));
    ```

- **Map 转为 JSON**
  
  - 一种情况是，Map 的键名都是字符串，这时可以选择转为对象 JSON。
  
  - ```javascript
    function strMapToJson(strMap) {
      return JSON.stringify(strMapToObj(strMap));
    }
    
    let myMap = new Map().set('yes', true).set('no', false);
    strMapToJson(myMap)
    // '{"yes":true,"no":false}'
    ```
  
  - 另一种情况是，Map 的键名有非字符串，这时可以选择转为数组 JSON。 
  
  - ```javascript
    function mapToArrayJson(map) {
      return JSON.stringify([...map]);
    }
    
    let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
    mapToArrayJson(myMap)
    // '[[true,7],[{"foo":3},["abc"]]]'
    ```

- **JSON 转为 Map**
  
  - ```javascript
    function jsonToStrMap(jsonStr) {
      return objToStrMap(JSON.parse(jsonStr));
    }
    
    jsonToStrMap('{"yes": true, "no": false}')
    // Map {'yes' => true, 'no' => false}
    ```

# WeakMap

`WeakMap`与`Map`的区别有两点。

- 首先，`WeakMap`只接受对象作为键名（`null`除外），不接受其他类型的值作为键名。

- 其次，`WeakMap`的键名所指向的对象，不计入垃圾回收机制。

- 设计目的：有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。

- 一旦不再需要这个对象，我们就必须手动删除这个引用，否则垃圾回收机制就不会释放占用的内存。

- 总之，`WeakMap`的专用场合就是，它的键所对应的对象，可能会在将来消失。`WeakMap`结构有助于防止内存泄漏。