# hooks-view-model

<p align="center">
  <img src="https://img.shields.io/github/license/hawx1993/hooks-view-model" />
  <img src="https://img.shields.io/github/stars/hawx1993/hooks-view-model" /> 
  <img src="https://img.shields.io/github/forks/hawx1993/hooks-view-model" /> 
  <img src="https://img.shields.io/github/issues/hawx1993/hooks-view-model" />
</p>

## Table of Contents

- [hooks-view-model](#hooks-view-model)
  - [Table of Contents](#table-of-contents)
  - [快速介绍](#快速介绍)
  - [与hooks对比](#与hooks对比)
  - [安装](#安装)
  - [模板生成](#模板生成)
  - [什么时候使用这个库](#什么时候使用这个库)
  - [什么时候不用这个库](#什么时候不用这个库)
  - [实例](#实例)
  - [API 文档](#api-文档)
  - [Q \& A](#q--a)

## 快速介绍


`hooks-view-model` 是一种实现UI与业务逻辑分离的符合直觉的解决方案。基于`hooks-view-model`，你可以不必再为闭包问题以及hooks问题而烦恼。`hooks-view-model` 提供状态管理，内存管理和持久化数据管理。使用`hooks-view-model`将带来如下诸多便利：

- 💼 提供全局与局部state管理，无需引入reducer或redux等状态管理方案；
- 🌲 提供全局缓存与持久化数据存储管理；
- 🎩 可使业务代码更具有组织性，可维护性和可测试性，职责划分更清晰。
- 🍰 有效避免组件内部太多state需要管理的问题，以对象形式简化useState，setState写法。
- 🍷 基于class的ViewModel内部无需关心hooks，可以做到更加专注业务逻辑开发。
- 👋 可实现全局数据更新，跨组件数据传递，无需`useReducer`或context
- 🌲 依据key划分不同store，view组件不会响应未使用到的store的状态变化，可解约性能开销
- 🍳 ViewModel将提供基础的生命周期函数，相较于useEffect 处理异步函数更方便
- 🍖 ViewModel 会根据react hooks生命周期自动触发内存回收，内存管理更方案
- 🥒 无需使用`useCallback` 处理因避免函数引用变动所导致的组件重渲染问题。
- 🍰 调用updater更新后，可同步获取最新的state值
- 👋 可实现细粒度更新对象的属性值，可实现immutable data

<img src="https://media.perfma.net/guitar/image/WBLaY17t9r4rqA4NeKQnX.png" />


## 与hooks对比

hooks-view-model` 主要用于分离UI与业务逻辑，可以解决 纯hooks组件的问题：

| hooks组件问题 | hooks-view-model  |
| --- | --- |
| 通常需要设置多个useState，无法细粒度更新属性值 | 可通过对象形式更新与解构数据，可细粒度更新属性值 |
|  使用`useReducer+context`全局共享状态思维负担大 |  全局状态更新只需使用`useGlobalState`hooks，api符合直觉，用法简单|
| useEffect模拟mounted缺乏语义化，请求异步函数处理麻烦 | 提供mounted和unmounted 钩子函数，语义化友好。非常适合异步处理 |
| 当组件达到一定复杂度的时候，堆积到一起的代码会变得越来越难以维护 | UI与逻辑做到了很好的分离，代码组织性强 |
| React Hook的闭包陷阱问题 | 由于方法都提到class中去维护了，所以不存在此问题 |
| useState 调用updater更新后，无法同步获取最新state值 | 可通过调用`getCurrentState` 同步获取最新值 |
| useState updater 无法实现细粒度更新对象属性值，需浅拷贝对象后覆盖 | 可通过`updateImmerState`实现细粒度更新 |
| useState updater 无法实现immutable 数据，即使memo 包裹子组件也会re-render| 可通过`updateImmerState`实现immutable 数据，不会re-render子组件 |


## 安装

```ts
$ yarn add hooks-view-model
```

## 模板生成

你可以根据如下步骤快速生成项目模板：

```bash
scripts: {
  "generate": "plop --plopfile ./node_modules/hooks-view-model/generators/index.js"
}
```
2、在根目录创建 `template.config.js` :

```bash
const dir_to_generate = './src/pages/';

module.exports = dir_to_generate;
```


## 什么时候使用这个库

1. 当你的业务项目很复杂，需要考虑分离UI与业务逻辑时
2. 当你进行团队协作时，你想要统一团队成员一致风格时
3. 当你想要在项目解决以上hooks缺陷或者闭包带来的困惑时

## 什么时候不用这个库

1. 当你正在开发组件库时，或者你的项目与业务无关时
2. 如果你不喜欢class的写法时，可以尝试这个库  [use-better-state](https://github.com/hawx1993/use-better-state)

## 实例

`Counter.View.tsx` is only for display ui and responding to updates to  `useCurrentState` and `useGlobalState`

```tsx
// Counter.View.tsx
import { CounterViewModel } from './Counter.ViewModel'
import { useVM } from 'hooks-view-model'

const CounterView = () => {
  const {  useCurrentState, increment, changeUserAge } = useVM(CounterViewModel, {
    count: 0, // 作为props传递给 CounterViewModel
  })
  const { user , count } = useCurrentState({
    user: { name: 'nilu', age: 0}
  });
  console.log('user', user);// {name: 'nilu', age: 10}
  return (
    <div>
      <button onClick={increment}>click to count</button>
      <button onClick={changeUserAge}>click to change user age</button>
      <span>{count}</span>
    </div>
  )
}
```

`Counter.ViewModel.ts` 
```tsx
// Counter.ViewModel.ts
import  StoreViewModel from 'hooks-view-model'

class CounterViewModel extends StoreViewModel {
  increment = () => {
    const { count } = this.props;// 通过this.props访问来自useVM传递过来的数据
    updateCurrentState({ count: count + 1 });
  };
   changeUserAge = () => {
    this.updateImmerState((draft) => {
      draft.user.age = 10;
    })
  },
  mounted = async () => {
    await someAsyncRequest();//当 componentDidMount 时自动运行
  }
  unmounted = () => {
    window.removeEventListener('');// 当componentWillUnmount 时自动运行
  }
}
export { CounterViewModel } 
```

## API 文档

更多使用方法和api 文档相关信息，可访问如下链接：

[English Api docs](https://github.com/hawx1993/hooks-view-model/wiki/English-version-of-hooks-view-model-docs) |
[中文Api文档](https://github.com/hawx1993/hooks-view-model/wiki/Chinese-version-of-hooks-view-model-api)


## Q & A

更多问题与解答，请访问： [Q & A]('./QA.md')
