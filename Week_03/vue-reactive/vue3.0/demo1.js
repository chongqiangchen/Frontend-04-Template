function isObject(val) {
  return typeof val === 'object' && val !== null;
}

function reactive(target) {
  return createReactiveObejct(target);
}

// 创建响应式对象
function createReactiveObejct(target) {
  if (!isObject(target)) {
    return target;
  }
  let baseHandler = {
    get(target, key, receiver) {
      console.log('获取');
      // reflect反射
      let result = Reflect.get(target, key, receiver);
      return result;
    },
    set(target, key, value, receiver) {
      console.log('设置');
      // target[key] = value; //如果设置没有成功，如果这个对象不可更改，是不会报错
      // 利用Reflect设置可以得到是否设置成功
      let res = Reflect.set(target, key, value, receiver);
      return res;
    },
    deleteProperty(target, key) {
      console.log('删除');
      return Reflect.deleteProperty(target, key);
    },
  };
  let observed = new Proxy(target, baseHandler);

  return observed;
}

// 代理对象
// 1. 内部创建一个观察者 proxy
// 获取proxy.name，调用get() {}
// 设置proxy.name, 调用Set() {}
// delete proxy.name 调用deleteProperty
let proxy = reactive({ name: 'zf' });
console.log(proxy.name);
proxy.name = '1';
delete proxy.name;
