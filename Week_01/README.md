# 学习笔记

1. 了解到 js 多重 for 循环中利用 label 可以指向性的跳转到对应的位置

```
  outer: for() {
    for() {
      break outer; // continue outer;
    }
  }
```

2. 进一步了解 Object.create 操作一个数组的时候，是利用了原型链进行 copy 原数组。

```
var arr1 = Object.create([1,2,3]);
console.log(arr1.__proto__) // [1,2,3]

arr1[0] = 2;
console.log(arr1[0]) // 2
console.log(arr1) // [2]
console.log(arr1.__proto__) // [1,2,3]
```

首先：访问一个对象或者数组的内容时候，我们会优先访问本身是否存在该值，若不存在会找原型上的值，若都没有返回 undefined
