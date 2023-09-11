# 关于 JS 的面向对象

JS 的面向对象基于原型链

## 面向对象OOP与面向过程

- 面向对象：一种编程思想，把系统抽象成一个对象的集合，以对象作为程序的基本单元，封装方法和属性，对象之间互相调用而不用关心对象内部的细节，提供重用性、灵活性和扩展性

- 面向过程：派生自命令式编程，通过函数调用或者过程调用来进行流程控制，把一个程序分解为若干个过程。

### 面向对象的特点

- 类与对象（抽象）：类定义事物的抽象特点（包含数据形式和操作方法），对象则是类的实例化，对应到现实中的具体某个事物
- 封装：隐藏了某一方法的具体细节
- 继承：一个子类会有一个父类，子类要比父类更加具体化
- 多态：由继承产生了不同的类

## 创建对象

JS 高程，在老版本的书中其实介绍了很多种花里胡哨的方法，但是在最新的第四版中，只保留了工厂、构造函数和原型三种方法，不知道是不是因为ES6引入class关键词后就没必要使用那些了。

### 工厂模式

应用工厂模式这一设计模式，能够创建多个类似对象，

但没有解决对象标识问题，不能判断新创建的对象是属于哪一个类。

``` js
function createPerson(name, age) {
    const o = new Object();
    o.name = name;
    o.age = age;
    o.sayName = function () {
        console.log(this.name);
    };

    return o;
}
```

### 构造函数模式

使用 new 关键词创建，没有显式创建对象，没有 return。

优点，能够判断它的构造函数和对象类型

缺点，多次实例化了方法

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.sayName = function () {
        console.log(this.name);
    };
}

const a1 = new Person('a1', '20');
console.log(a1.constructor === Person); // true
console.log(a1 instanceof Person); // true
```

#### new 做了什么？

1. 创建一个对象
2. 链接原型
3. 调用构造，绑定this
4. 如果构造函数返回值是一个对象，则返回

```js
// 实现一个new
function MyNew(constr, ...args) {
    // 创建对象并链接原型
    // 等价于
    // const o = {};
    // o.setPrototypeOf(constr.prototype);
    const o = Object.create(constr.prototype);
   
    // 应用构造函数，绑定this
    const result = constr.apply(o, args);
    
    // 返回对象
    return (typeof result === 'object' && result != null) ? result : obj;
}
```

### 原型模式

扩展构造函数的原型

缺点，所有的属性都被共享了

```js
function Person2() {}

Person2.prototype.name = 'a2';
Person2.prototype.age = '20';
Person2.prototype.sayName = function () {
    console.log(this.name);
};
```

### 组合使用

一种折中，使用最多

```js
function Person3(name, age) {
    this.name = name;
    this.age = age;
}

Person3.prototype.sayName = function () {
    console.log(this.name);
};
```

## 实现继承

JS 的继承基于原型链，即使是ES6的class - extends 特性也是基于此，

这里省略关于原型链相关的介绍

讲一讲几种ES5实现继承的方式

### 盗用构造函数（经典继承

借用父类构造函数，基本上不能单独使用

缺点，多次实例化方法，并且子类实例不能访问到父类原型上定义的方法

```js
//存在与构造函数模式建立对象产生的相同问题，很少单独使用
function SuperType(name) {
  this.colors = ["red", "blue", "white"];
  this.name = name;
}

function SubType(name, age) {
  SuperType.call(this, name); //子对象this给父构造函数
  this.age = age;
}
const son = new SubType("a2", 24);
console.log(son.name + "," + son.age);
```

### 组合继承（伪经典继承

综合原型链和盗用构造函数，缺点是调用两次父类构造函数

```js
// 最常用
// 缺点：调用两次超类构造函数
function SuperType2(name) {
  this.name = name;
  this.colors = ["red"];
}
SuperType2.prototype.sayName = function () {
  console.log(this.name);
};
function SubType2(name, age) {
  //继承属性
  SuperType2.call(this, name); //借用构造函数
  this.age = age;
}
//继承方法
SubType2.prototype = new SuperType2(); //为什么要new?-防止修改超类原型
SubType2.prototype.constructor = SubType2;

SubType2.prototype.sayAge = function () {
  console.log(this.age);
};

const instance = new SubType2("jnz", 18); 
// SubType2 { name: 'jnz', colors: [ 'red' ], age: 18 }
console.log(instance);
```

### 原型式继承

严格意义上不涉及构造函数的继承，

构造一个临时的构造函数，链接原型，返回一个临时对象，实质上是对传入对象的浅复制

ES5引入了 Object.create() 方法将这种概念规范化了。

缺点，一种浅复制，对象内部的复杂类型是共享的

（这也是它的目的，在对象之间共享信息）

```js
// 要求以一个对象为基础,进行一次浅复制
// 最早提出的方式
function object(o) {
    function F() { }
    F.prototype = o;
    return new F();
}

var person3 = {
    name: 'jnz',
    friends: ['yjy', 'zhq']
};
var anotherPerson = Object.create(person3);
anotherPerson.friends.push('wz');
var yetPerson = Object.create(person3);
yetPerson.friends.push('wyt');
// [ 'yjy', 'zhq', 'wz', 'wyt' ]
console.log(person3.friends);
```

### 寄生式继承

与原型式类似，创建一个父类对象，增强它，再返回

```js
function createAnthoer(original) {
    // 任意一种创建对象副本的形式均可
    const clone = Object.create(original);
    // 增强它
    clone.sayHi = function () {
		console.log('hi');
    }
    // 返回
    return clone;
}
```

### 寄生式组合继承

对组合继承的改良，避免两次调用父类构造函数，最佳模式

核心是不使用构造函数给子类原型赋值还是采用副本的形式。

```js
//利用超类原型副本优化组合继承，最完美
function inheritPrototype(subType, superType) {
    //创建原型副本而不是调用超类构造函数
    var prototype = Object.create(superType.prototype); 
    prototype.constructor = subType; //连接构造函数
    subType.prototype = prototype;
}

function SuperType4(name) {
    this.name = name;
    this.colors = ['red'];
}
SuperType4.prototype.sayName = function () {
    console.log(this.name);
};
function SubType4(name, age) {
    SuperType4.call(this, name);
    this.age = age;
}

inheritPrototype(SubType4, SuperType4);

SubType4.prototype.sayAge = function () {
    console.log(this.age);
};

```

## ES6 的 类

[ES5的继承和ES6的继承有什么区别？让Babel来告诉你 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/404315749)

class 关键词创建的其实是一种特殊的函数

### 区别

1. class 创建的构造函数，不能当做普通函数调用
2. 静态方法和原型方法不可被枚举 // defineProperty 时，描述符是不可枚举
3. 子类可以通过[[prototype]]找到父类，ES5不行
4. 先创造父类this，再对通过子类构造函数其进行修改（因此再super()之前不能调用this），ES5是先创造子类实例this，再执行父类构造函数添加方法和属性

```js
class SuperType5 {}

class SubType5 extends SuperType5 {}

// [[proto]]: {}
console.log('[[proto]]:', Object.getPrototypeOf(SubType4)); 
// [[proto]]: [class SuperType5]
console.log('[[proto]]:', Object.getPrototypeOf(SubType5)); 
```



