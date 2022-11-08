# hooks-view-model

<p align="center">
  <img src="https://img.shields.io/github/license/hawx1993/hooks-view-model" />
  <img src="https://img.shields.io/github/stars/hawx1993/hooks-view-model" /> 
  <img src="https://img.shields.io/github/forks/hawx1993/hooks-view-model" /> 
  <img src="https://img.shields.io/github/issues/hawx1993/hooks-view-model" />
</p>

`hooks-view-model` 主要用于分离UI与业务逻辑，可以解决 纯hooks组件的问题：

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


`hooks-view-model`是一种通过拆分UI视图与业务逻辑的解决方案，使用hooks-view-model将带来如下诸多便利：

- 💼 提供全局与局部state管理，无需引入reducer或redux等状态管理方案；
- 🌲 提供全局缓存与持久化数据存储管理；
- 🎩 业务代码引入该方案，将使业务代码更具有可组织性，可维护性和可测试性，职责划分更清晰，避免面条式写法杂糅一起造成的组件维护性下降，数据处理混乱等问题的出现。
- 🍰 有效避免组件内部太多state需要管理的问题，以对象形式简化useState，setState写法。
- 🍷 相较于原生的useState hooks，数据清晰，更方便debug，可在控制台输入`globalStore`查看所有状态存储信息
- 👋 可实现全局数据更新，跨组件数据传递，无需`useReducer`或context
- 🌲 依据key划分不同store，view组件不会响应未使用到的store的状态变化，可解约性能开销
- 🍳 ViewModel将提供基础的生命周期函数，无需频繁在hooks组件中引入useEffect进行处理
- 🍖 ViewModel 会根据react hooks生命周期自动触发内存回收，内存管理更方案
- 🥒 由于函数已经提取到ViewModel，所以无需使用`useCallback` 处理因避免函数引用变动所导致的组件重渲染问题。


基于`react hooks `实现，通过拆分react 视图和业务逻辑，做到真正的分而治之，View 只负责展示视图，ViewModel 负责状态和数据处理，View 通过 `useGlobalStore/useCurrentStore` 获取数据并主动更新视图。

<img src="https://media.perfma.net/guitar/image/WBLaY17t9r4rqA4NeKQnX.png" />

由上图可知，顾名思义，ViewModel就是用来处理数据绑定和dom 事件监听的。

基于`hooks-view-model`，可做到无需useCallback，无需useReducer，无需redux等技术方案。`hooks-view-model`是集状态管理，变量的存储管理和持久化数据管理于一体的解决方案。

### 快速使用

1、安装：
```bash
$ yarn add hooks-view-model
```

2、import

```ts
import StoreViewModel, { useVM } from 'hooks-view-model'
```
### 快速生成项目模板

执行如下步骤，可一键生成模板文件：

1、添加脚本命令
```bash
scripts: {
  "generate": "plop --plopfile ./node_modules/hooks-view-model/generators/index.js"
}
```

2、根目录创建`template.config.js`

指明模板需要生成的相对路径地址:
```bash
const dir_to_generate = './src/pages/';

module.exports = dir_to_generate;
```
### 容器方案：View 和 ViewModel


首先：AppView  视图组件通过useVM实例化AppViewModel，并获取`AppViewModel`和`StoreViewModel`的实例方法；

其次：AppView 视图组件通过`useGlobalState`和`useCurrentState`获取全局和当前页面状态state，其中：

- `useGlobalState` 响应来自`updateGlobalStateByKey` 的更新
- `useCurrentState` 响应来自`updateCurrentState` 的更新

>View：获取数据并展示数据

```tsx
// AppView.tsx
import { AppViewModel } from './AppViewModel'
import { useVM } from 'hooks-view-model'
import { GLOBAL_KEYS } from 'app/path/to/globalKeys'

const AppView = () => {
  const { changeAddress, useGlobalState } = useVM(AppViewModel, {
    address: '0x000',
  })
  const { address } = useGlobalState(GLOBAL_KEYS.View)
  return (
    <div>
      <button onClick={changeAddress}>click to change address</button>
      <span>{address}</span>
    </div>
  )
}

```

>ViewModel：处理数据，管理状态和数据

`updateGlobalStateByKey` 和 `updateCurrentState` 相当于在class中可以使用的setState方法，只不过需要保证class中的所有方法都是箭头函数，否则会报错

```tsx
// AppViewModel.ts
import  StoreViewModel from 'hooks-view-model'
import { GLOBAL_KEYS } from 'app/path/to/globalKeys'

class AppViewModel extends StoreViewModel {
  updateViewStore = <T>(value: T) => {
    this.updateGlobalStateByKey(GLOBAL_KEYS.View, value);// 相当于setState
  }
  changeAddress = () => {
    this.updateViewStore(this.props.address)
  }
}
export { AppViewModel } 
```

### 为什么要开发这个项目


详情查看我在知乎的回答👉 [react hooks有必要分离 ui 和业务逻辑吗？ - trigkit4的回答 - 知乎](https://www.zhihu.com/question/561700319/answer/2741505136)

## API



详情查看👉: [中文文档](https://github.com/hawx1993/hooks-view-model/wiki/Chinese-version-of-hooks-view-model-api)

View detail: 👉[English docs](https://github.com/hawx1993/hooks-view-model/wiki/English-version-of-hooks-view-model-docs)
