# 箭头函数

引入箭头函数有两个方面的作用：更简短的函数并且不绑定`this`。

## 1. 短

## 2. 没有单独的this

- 箭头函数之前
  
  - 每一个新函数根据它是被如何调用的来定义这个函数的this值：
    
    - 如果是该函数是一个构造函数，this指针指向一个新的对象
    - 在严格模式下的函数调用下，this指向undefined
    - 如果是该函数是一个对象的方法，则它的this指针指向这个对象
    - 等等
  
  - 箭头函数不会创建自己的`this,它只会从自己的作用域链的上一层继承this`。
    
    - ```js
      function Person(){
        this.age = 0;
      
        setInterval(() => {
          this.age++; // |this| 正确地指向 p 实例
        }, 1000);
      }
      
      var p = new Person();
      ```

## 3. call apply bind只能传参数不能赋予作用域

由于 箭头函数没有自己的this指针，通过 `call()` *或* `apply()` 方法调用一个函数时，只能传递参数（不能绑定this---译者注），他们的第一个参数会被忽略。（这种现象对于bind方法同样成立---译者注）

## 4. 没有arguements, 只有rest

```js
function foo(arg) {
  var f = (...args) => args[0];
  return f(arg);
}
foo(1); // 1

function foo(arg1,arg2) {
    var f = (...args) => args[1];
    return f(arg1,arg2);
}
foo(1,2);  //2
```

## 5. 没有prototype

## 6. 各种返回

- 在一个简写体中，只需要一个表达式，并附加一个隐式的返回值。在块体中，必须使用明确的`return`语句。
  
  - ```js
    var func = x => x * x;
    // 简写函数 省略return
    
    var func = (x, y) => { return x + y; };
    //常规编写 明确的返回值
    ```

- 记住用`params => {object:literal}`这种简单的语法返回对象字面量是行不通的。
  
  - ```
    var func = () => { foo: 1 };
    // Calling func() returns undefined!
    
    var func = () => { foo: function() {} };
    // SyntaxError: function statement requires a name
    
    var func = () => ({foo: 1});
    ```
  
  - 必须用圆括号包起来