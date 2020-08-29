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

3. til_tac_toe

- 绘制三子棋：给每个格子加上对应的 id(x_y)，便于获取其位置
- 落子绘制：通过监听 board 点击事件，得到对应点击的 target 目标，进行绘制
- 判断输赢：进行横向，竖向，正斜，反斜判断颜色相同的情况，总分为 3 则为胜利
- 预先判断输赢情况： 在当前棋盘上空位落一个子判断是否会赢
- 选择最佳位置和预测结果： 对当前棋盘空位进行逐个落子判断，要获知我方即将面临的情况就是反向判断敌方的结果，然后不断对比所存下来的最佳情况进行保存

4. 异步编程中学习了 async generate 的配合使用

> 疑问： 对这个的实际用途我还是比较好奇？是否直接使用 setInterval 就可以了？

```
async function* counter() {
  let i = 0;
  while(true) {
    await sleep(1000);
    yield i++;
  }
}

(async function() {
  for await(let v of counter()) {
    console.log(v);
  }
})()
```
