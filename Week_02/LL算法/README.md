# 乘法处理规则

`1 X 3`

## 词法分析

```
  {
    type: 'Number',
    value: '1'
  },
  {
    type: 'X',
    value: 'X'
  },
  {
    type: '3',
    value: '3'
  }
```

## 语法分析成 AST

几个规则

```
Number => { type: 'mul', children: [{type： ‘Number', value: value}] }

Mul \* => {type: 'mul', children: [prevMul, {type: 'X', value: 'X'}, {type: Number, value: value}]}

Mul / => {type: 'mul', chilren: [prevMul, {type: '/', value: '/'}, {type: Number, value: value}]}
```

```
1. Step1 = Number 1 =>
   {
    type: 'mul',
    children: [
      {
        type: Number,
        value: 1
      }
    ]
   }

2. Step2 = Mul \* 3 =>
   {
    type: 'mul',
    chilren: [
      Step1,
      {
        type: 'X',
        value: 'X'
      },
      {
        type: Number,
        value: 3
      }
    ]
   }
```

# 乘法加法处理

`1 X 3 + 2 + 4`
规则：

```
Number => Mul

第一个Mul => Add

Add +/- => {
		type: 'Add',
		children: [
			prevAdd,
			+/-,
			Number => Mul
		]
}
```

AddExp

1. 第一个进来的一定是 Number, 那么就会调用 MulExp,将 1 X 3 递归成

```
  Step1 = {
    type: 'mul',
    children: [
      {
        type: 'mul',
        children: [{
          type: 'number',
          value: 1
        }]
      },
      {
        type: 'X',
        value: 'X'
      },
      {
      type: '3',
      }
    ]
  }
```

2. 进行 AddExp 规则处理，由于第一个为 mul，所以需要转成 AddExp

```
    	Step2 = {
    		type: 'add',
    		chilren: [
    			Step1
    		]
    	}
```

3. 进行 AddExp + 处理

```
  {
    type: 'add',
    children: [
      Step2,
      {type: '+', value: '+'},
      Number => Mul ({type: 'mul', chidlren:[{type: Number, value: 2}]})
    ]
  }
```

4. 进行 AddExp + 处理
