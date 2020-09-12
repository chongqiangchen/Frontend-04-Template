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
      // reflect反射
      // result 是当前获取到的值
      let result = Reflect.get(target, key, receiver);

      //收集依赖 订阅 把当前的key和这个effect对应起来
      track(target, key); //如果目标上的key变化了，重新让数组中的effect执行即可

      return isObject(result) ? reactive(result) : result;
    },
    set(target, key, value, receiver) {
      // target[key] = value; //如果设置没有成功，如果这个对象不可更改，是不会报错
      // 利用Reflect设置可以得到是否设置成功
      let hadKey = hasOwn(target, key);
      let oldValue = target[key];
      let res = Reflect.set(target, key, value, receiver);

      if (!hadKey) {
        trigger(target, 'add', key);
      } else if (oldValue !== value) {
        // 老值与新值不相等的时候才会修改属性
        // 屏蔽无意义的修改
        trigger(target, 'add', key);
      }

      return res;
    },
    deleteProperty(target, key) {
      return Reflect.deleteProperty(target, key);
    },
  };
  let observed = new Proxy(target, baseHandler);
  toProxy.set(target, observed);
  toRaw.set(observed, target);
  return observed;
}

let activeEffectStacks = [];
let targetsMap = new WeakMap();
function track(target, key) {
  // 如果target中的key 变化了，我就执行数组中的方法
  let effect = activeEffectStacks[activeEffectStacks.length - 1];
  if (effect) {
    // 有对应关系，才创建关联
    let depsMap = targetsMap.get(target);
    if (!depsMap) {
      targetsMap.set(target, (depsMap = new Map()));
    }

    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, (deps = new Set()));
    }

    if (!deps.has(effect)) {
      deps.add(effect);
    }
  }
}

function trigger(target, type, key) {
  // 简单起见这样处理，事实上源码中会对相应的type做出相关的处理和存储最终需要执行的effects
  // 调用run 进行执行  effects.forEach(run);
  let depsMap = targetsMap.get(target);
  if (depsMap) {
    let deps = depsMap.get(key);
    if (deps) {
      // 当前key 对应的effect方法
      deps.forEach((effect) => {
        effect();
      });
    }
  }
}

// 副作用
function effect(fn) {
  // 需要将fn变为响应式的函数，在fn中内部值变动时调用
  let effect = createReactiveEffect(fn);
  effect(); //默认执行一次
}

function createReactiveEffect(fn) {
  let effect = function () {
    // 运行 1.fn执行，2. 把effect存入栈中
    try {
      activeEffectStacks.push(effect);
      fn(); // 在执行过程会触发相关的getter,这是为什么77-78行代码可以直接那数组最后一个或者第一个进行判断是否有存在关联的effect
    } finally {
      activeEffectStacks.pop(); // 因为已经被关联了，收集到对应的位置，所以堆中不再需要这个effect
    }
  };
  return effect;
}

// 依赖收集 - 发布订阅
// 1. 首先我们需要将effect中传入的callback变为响应式，故创建一个函数为createReactiveEffect
// 2. createReactiveEffect需要做两件事：
//  - 需要创建一个effect ,让callback执行，并保存到stack中，用于依赖收集关联
//  - 其次因为默认需要执行一次effect所以需要抛出去一个effect进行执行
// 3. 依赖收集（订阅）track，因为在effect第一次执行的时候会调用一次每个属性的getter,因此可以在此处进行收集 {propname: [effect]}
//  - 关键的一点是需要一个形式将effect关联对应Target下的key
//  - new WeakMap(target, new Map(key, [effect0, effect1]))
// 4. 发布 trigger，简单起见这样处理，事实上源码中会对相应的type做出相关的处理和存储最终需要执行的effects，调用run 进行执行  effects.forEach(run);
let obj = reactive({ name: '123' });
effect(() => {
  console.log(obj.name);
});
obj.name = 1;
