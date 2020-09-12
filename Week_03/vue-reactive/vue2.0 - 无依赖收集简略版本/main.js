// 利用Object.defineProperty 就是可以重新定义属性，给属性增加getter setter
// 因为Object.defineProperty 不能直接观察数组，所以需要改写Push，shift，unshift等，但不是重写
let oldArrayPrototype = Array.prototype;
let proto = Object.create(oldArrayPrototype);
['push', 'shift', 'unshift'].forEach((method) => {
  proto[method] = function () {
    // 函数劫持， 把函数改写，但不会影响原有函数的执行
    updateView(); //切片编程
    oldArrayPrototype[method].call(this, ...arguments);
  };
});

function observe(target) {
  if (typeof target !== 'object' && target !== null) {
    return target;
  }

  console.log('--');

  if (Array.isArray(target)) {
    // target.__proto__ = proto;
    Object.setPrototypeOf(target, proto);
  }

  for (key in target) {
    defineReactive(target, key, target[key]);
  }
}

const record = new WeakMap();

function defineReactive(target, key, value) {
  Object.defineProperty(target, key, {
    get() {
      if (record.has(target)) {
        return value;
      }
      observe(value);
      record.set(target, true);
      // 依赖收集
      return value;
    },
    set(newValue) {
      console.log(2);
      // 广播依赖收集
      if (newValue !== value) {
        observe(newValue);
        updateView();
        value = newValue;
      }
    },
  });
}

function updateView() {
  console.log('更新视图');
}

let data = { name: { a: { b: '12' } } };
observe(data);
data.name.a = { c: 1 };
console.log(data);
// data.name.a = 2;
