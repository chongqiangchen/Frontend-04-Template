function isObject(val) {
  return typeof val === 'object' && val !== null;
}
function hasOwn(target, key) {
  return target.hasOwnProperty(key);
}

const toProxy = new WeakMap(); //弱引用，防置{源对象：代理后的对象}
const toRaw = new WeakMap(); // 被{代理过的对象： 原对象}

function reactive(target) {
  return createReactiveObejct(target);
}

// 创建响应式对象
function createReactiveObejct(target) {
  if (!isObject(target)) {
    return target;
  }

  // 防止一个obj多次被new Proxy(obj)
  let proxy = toProxy.get(target);
  if (proxy) {
    return proxy;
  }

  // 防止一个proxy(new Proxy(obj)),再次被代理
  if (toRaw.has(target)) {
    return target;
  }

  let baseHandler = {
    get(target, key, receiver) {
      console.log('获取');
      // reflect反射
      let result = Reflect.get(target, key, receiver);
      // result 是当前获取到的值
      return isObject(result) ? reactive(result) : result;
    },
    set(target, key, value, receiver) {
      console.log('设置');
      // target[key] = value; //如果设置没有成功，如果这个对象不可更改，是不会报错
      // 利用Reflect设置可以得到是否设置成功
      let hadKey = hasOwn(target, key);
      let oldValue = target[key];
      let res = Reflect.set(target, key, value, receiver);

      if (!hadKey) {
        console.log('新增属性');
      } else if (oldValue !== value) {
        // 老值与新值不相等的时候才会修改属性
        // 屏蔽无意义的修改
        console.log('修改属性');
      }

      return res;
    },
    deleteProperty(target, key) {
      console.log('删除');
      return Reflect.deleteProperty(target, key);
    },
  };
  let observed = new Proxy(target, baseHandler);
  toProxy.set(target, observed);
  toRaw.set(observed, target);
  return observed;
}

// 代理对象
// 1. 内部创建一个观察者 proxy
//    获取proxy.name，调用get() {}
//    设置proxy.name, 调用Set() {}
//    delete proxy.name 调用deleteProperty
// 2. 设置对应的get set
// 3. 当存在多层对象时，如调用Proxy.name.z：
//    先取值proxy.name 触发get方法
//    再调用obj.z触发get / set方法
//    因此可以在第一次触发get的时候判断结果是否是一个对象进行recative进行处理
//    疑问？为什么defineProperty要初始的时候就进行递归，而不是在需要的地方进行递归呢？
let proxy = reactive({ name: { z: 1 } });
// proxy.name.z = { c: 3 };
console.log(proxy);

// 4. 需要记录这个对象，如若代理过就不再new Proxy，那么需要hash表，但是Map的key无法存储对象，然而我们需要{object: proxy}，判断该对象是否被代理过，这时候就需要weakMap，那么这时候我们需要记录两种情况：
//  - 防止一个obj多次被new Proxy(obj)
//  - 防止一个proxy(new Proxy(obj)),再次被代理

// 5. 注意一点就是如果reactive一个数组，push一次将会触发两次设置，一个是增加新值，一个是改变length,所以我们需要过滤掉length修改的那一次处理
// - 判断是否存在这个Key
// - 判断老值和新值是否相等
