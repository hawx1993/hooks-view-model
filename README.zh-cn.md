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


`hooks-view-model` 是一种实现UI与业务逻辑分离的符合直觉的解决方案。基于`hooks-view-model`，你可以不必再为闭包问题以及上述hooks问题而烦恼。`hooks-view-model` 为解决状态管理，内存存储，持久化数据而生。使用`hooks-view-model`将带来如下诸多便利：

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
| useState 写法难用，如果有很多state，需要一个个去维护，写法不够简洁 | 可通过对象形式更新与解构数据，写法简洁 |
|  useReducer + context的全局状态难用，仍然需要定义很多action type，还需要提供provider，使用useReducer跨组件共享状态很麻烦|  全局状态更新只需使用`useGlobalState`hooks，用法简单|
| 生命周期需要引入useEffect，需要手动管理，且不够语义化 | 提供mounted和unmounted 钩子函数，可自动执行，语义化友好 |
| 基于hooks的业务组件，内部方法依然难以做到复用，应抽离出去单独维护 | class 写法可通过继承 实现复用，还可以通过`useVM`引入其他viewModel进行复用，复用性高 |
| 当接收新的props，需要手动使用useEffect观察props变化，没有直接的钩子可以自动触发 | class 提供`onPropsChanged` 钩子函数，可自动触发执行 |
| 当组件达到一定复杂度的时候，堆积到一起的代码会变得越来越难以维护 | UI与逻辑做到了很好的分离，代码组织性强 |
| React Hook的闭包陷阱问题 | 由于方法都提到class中去维护了，所以不存在此问题 |
| useState 调用updater更新后，无法同步获取最新state值| 可通过调用getCurrentState 同步获取最新值 |
| 调用useState updater 无法实现细粒度更新对象属性值，需浅拷贝对象后覆盖 | 可通过updateImmerState实现细粒度更新 |
| 调用useState updater 无法实现immutable 数据，即使memo 包裹子组件也会re-render| 可通过updateImmerState实现immutable 数据，不会re-render子组件 |


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
  const { count, useCurrentState, increment } = useVM(CounterViewModel, {
    count: 0, // 作为props传递给CounterViewModel
  })
  const { address = 'ZheJiang Province' } = useCurrentState()
  return (
    <div>
      <button onClick={increment}>click to count</button>
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
}
export { CounterViewModel } 
```

## API 文档

更多使用方法和api 文档相关信息，可访问如下链接：

[English docs](https://github.com/hawx1993/hooks-view-model/wiki/English-version-of-hooks-view-model-docs) |
[中文文档](https://github.com/hawx1993/hooks-view-model/wiki/Chinese-version-of-hooks-view-model-api)


## Q & A

更多问题与解答，请访问： [Q & A]('./QA.md)