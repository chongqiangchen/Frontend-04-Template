## 学习笔记

### vue reactive:

#### vue-2.0:

使用 `Object.defineProperty` 的缺陷

- 需要初始递归
- 数组改变 `length` 是无效的
- 对象不存在的属性不能被自动拦截

#### vue-3.0

_代理对象_

1. 内部创建一个观察者 `proxy`

- 获取 `proxy.name`，调用` get() {}`
- 设置 `proxy.name`, 调用 `Set() {}`
- `delete proxy.name` 调用 `deleteProperty`

2. 设置对应的 `get set`
3. 当存在多层对象时，如调用` Proxy.name.z`：

- 先取值`proxy.name` 触发 `get` 方法
- 再调用 `obj.z` 触发 `get / set` 方法
- 因此可以在第一次触发 `get` 的时候判断结果是否是一个对象进行 `recative` 进行处理
- 疑问？为什么 `defineProperty` 要初始的时候就进行递归，而不是在需要的地方进行递归呢？

_依赖收集 - 发布订阅_

1.  首先我们需要将 `effect` 中传入的 `callback` 变为响应式，故创建一个函数为 `createReactiveEffect`
2.  `createReactiveEffect` 需要做两件事：

- 需要创建一个 `effect` ,让 `callback` 执行，并保存到 `stack` 中，用于依赖收集关联
- 其次因为默认需要执行一次 `effect`所以需要抛出去一个 `effect` 进行执行

3.  依赖收集（订阅）`track`，因为在 `effect` 第一次执行的时候会调用一次每个属性的 getter,因此可以在此处进行收集 `{propname: [effect]}`

- 关键的一点是需要一个形式将 `effect` 关联对应 `Target` 下的 `key`
- `new WeakMap(target, new Map(key, [effect0, effect1]))`

4.  发布 `trigger`，简单起见这样处理，事实上源码中会对相应的 `type` 做出相关的处理和存储最终需要执行的 `effects`，调用 `run` 进行执行 `effects.forEach(run)`;

### 拖拽
