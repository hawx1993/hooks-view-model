# hooks-view-model

<p align="center">
  <img src="https://img.shields.io/github/license/hawx1993/hooks-view-model" />
  <img src="https://img.shields.io/github/stars/hawx1993/hooks-view-model" /> 
  <img src="https://img.shields.io/github/forks/hawx1993/hooks-view-model" /> 
  <img src="https://img.shields.io/github/issues/hawx1993/hooks-view-model" />
</p>


`hooks-view-model`是一种通过拆分UI视图与业务逻辑的解决方案，可做到无需useReducer，无需redux等技术方案实现全局状态更新而不会渲染无关组件。`hooks-view-model`是集状态管理，变量的存储管理和数据的持久化管理于一体的解决方案。

使用`hooks-view-model`将带来如下诸多便利：

- 💼 提供全局与局部state管理，无需引入reducer或redux等状态管理方案；
- 🌲 提供全局缓存与持久化数据存储管理；
- 🎩 可使业务代码更具有组织性，可维护性和可测试性，职责划分更清晰，避免面条式写法杂糅一起造成的组件维护性下降，数据处理混乱等问题的出现。
- 🍰 有效避免组件内部太多state需要管理的问题，以对象形式简化useState，setState写法。
- 🍷 相较于原生的useState hooks，数据清晰，更方便debug，可在控制台输入`globalStore`查看所有状态存储信息
- 👋 可实现全局数据更新，跨组件数据传递，无需`useReducer`或context
- 🌲 依据key划分不同store，view组件不会响应未使用到的store的状态变化，可解约性能开销
- 🍳 ViewModel将提供基础的生命周期函数，无需频繁在hooks组件中引入useEffect进行处理
- 🍖 ViewModel 会根据react hooks生命周期自动触发内存回收，内存管理更方案
- 🥒 无需使用`useCallback` 处理因避免函数引用变动所导致的组件重渲染问题。
- 🍰 调用updater更新后，可同步获取最新的state值
- 👋 可实现细粒度更新对象的属性值


StoreViewModel内部基于`react useState hooks`实现，通过拆分react 视图和业务逻辑，做到真正的分而治之：View 只负责展示视图，ViewModel 负责状态和数据处理，View 通过 `useGlobalState/useCurrentState` 获取数据并主动更新视图。

<img src="https://media.perfma.net/guitar/image/WBLaY17t9r4rqA4NeKQnX.png" />





### 与hooks组件的对比

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
| 调用updater无法实现细粒度更新对象属性值，需浅拷贝对象后覆盖 | 可通过updateImmerState实现细粒度更新 |


### 快速使用

1、安装：
```bash
$ yarn add hooks-view-model
```

2、import

```ts
import StoreViewModel, { useVM } from 'hooks-view-model'
```

### 容器方案：View 和 ViewModel


首先：AppView  视图组件通过useVM实例化AppViewModel，并获取`AppViewModel`和`StoreViewModel`的实例方法；

其次：AppView 视图组件通过`useGlobalState`和`useCurrentState`获取全局和当前页面状态state，其中：

- `useGlobalState` 响应来自`updateGlobalStateByKey` 的更新
- `useCurrentState` 响应来自`updateCurrentState` 的更新

1、View：获取数据并展示数据

```tsx
// App.View.tsx
import { AppViewModel } from './App.ViewModel'
import { useVM } from 'hooks-view-model'
import { usePrevious } from '@/hooks';

const AppView = () => {
  const { perviousAddress } = usePrevious();
  const { changeAddress, useCurrentState } = useVM(AppViewModel, {
    address: perviousAddress,
  })
  const { address = 'ZheJiang Province' } = useCurrentState()
  return (
    <div>
      <button onClick={changeAddress}>click to change address</button>
      <span>{address}</span>
    </div>
  )
}
```


2、ViewModel：管理状态和处理数据

`updateGlobalStateByKey` 和 `updateCurrentState` 相当于在class中可以使用的setState方法，只不过需要保证class中的所有方法都是箭头函数，否则会报错


```tsx
// App.ViewModel.ts
import  StoreViewModel from 'hooks-view-model'

class AppViewModel extends StoreViewModel {
  changeAddress = () => {
    this.updateCurrentState(this.props.address);// 相当于setState
  }
}
export { AppViewModel } 
```

### Q & A

#### 1、🤔 Question: 使用`hooks-view-model` 要怎么用hooks？

首先，`hooks-view-model` 虽然是基于class，但可以通过`useVM` hooks与其他hooks完美融合使用，第三方hooks返回的state或api，都可以作为props传递给viewModel。
其次，`hooks-view-model` 推荐用于处理复杂的业务逻辑， 而hooks 推荐用于抽离可复用的可观察副作用的逻辑。两者的定位不一样，有明确的职责划分，区分清晰才不会产生使用上的混乱。

```ts
const { perviousName } = usePrevious();
const { useCurrentState } = useVM(AppViewModel, { perviousName })
```

#### 2、🤔 Question: 支持细粒度更新吗？

`hooks-view-model` 是支持细粒度更新的，可以使用`updateImmerState` api 来实现细粒度更新。参考：[https://github.com/hawx1993/hooks-view-model/wiki/Chinese-version-of-hooks-view-model-api#updateimmerstate](https://github.com/hawx1993/hooks-view-model/wiki/Chinese-version-of-hooks-view-model-api#updateimmerstate)


#### 3、🤔 Question: 支持使用hooks抽离业务逻辑不行吗？使用class有何优势？

首先，使用class 可以很好解决上述react hooks的问题；其次，业务逻辑抽离到class中，依然是函数式组件。
class相比于function 天然的具有可组织性，可扩展性(extends)，和可维护性。
使用class 可以专注业务逻辑的书写，而无需关注react hooks带来的各种麻烦问题，诸如useRef，useCallback，useReducer，useState等，写起业务逻辑来更加纯粹；

基于class的viewModel可以更好的维护业务逻辑代码，可以使用装饰器，可以使用public，private等关键字，显示提高代码可维护性和扩展能力。而可复用的hooks可以用来抽象业务逻辑实现副作用观察和逻辑复用，两者具有不同的心智模型。

此外，使用class的继承逻辑，可以实现每个业务组件View和ViewModel都能复用基类的方法，对于维护业务逻辑，规范化业务使用场景都有较好的帮助。而函数的书写方式就比较松散，容易千人千面，很难引起规范化。


#### 4、🤔 Question: 为什么要开发这个项目


详情查看我在知乎的回答👉 [react hooks有必要分离 ui 和业务逻辑吗？ - trigkit4的回答 - 知乎](https://www.zhihu.com/question/561700319/answer/2741505136)

#### 5、🤔 Question: 如何使用其他react hooks方法？

如果是useMemo可考虑抽成单个hooks去使用；

useRef可以把其返回的值，通过props方式传递给vm；

```ts
const isDragging = useRef(null);  
useVM(LicenseViewModel, {isDragging})
```
useCallback：基本不需要使用useCallback，因为函数已经抽离到class中了，如果需要的话，可以：useCallback可以把vm返回的方法包装一层：
```ts
 const {fetchLicense, resetCustom, useCurrentStore} = useVM(LicenseViewModel, {})
const resetCustomCb = useCallback(resetCustom, [resetCustom]);
```

`useContext` 可能也不需要使用了，因为有`useGlobalState`；`useContext` 可在view中使用，然后dispatch通过props方式传递给vm；参考上面的方式；

#### 6、🤔 Question: 如何与外部第三方库兼容

假设外部第三方库是hooks，可直接拿过来用，完全可以兼容，我们的view组件本质就是hooks，直接在view组件使用没什么问题，如果viewModel需要这个数据，可以作为props传递给viewModel。

```ts
// App.View.tsx
import { useRequest } from 'ahooks';
import Mock from 'mockjs';
import React from 'react';
import { useVM  } from 'hooks-view-model'
import { AppViewModel } from './App.ViewModel.ts'

export default () => {
  const { getEmail } = useVM(AppViewModel)
  const { data, loading, run } = useRequest(getEmail, {
    debounceWait: 1000,
    manual: true,
  });

  return (
    <div>
      <input placeholder="Search Emails" onChange={(e) => run(e.target.value)} />
      {loading ? (
        <p>loading</p>
      ) : (
        <ul style={{ marginTop: 8 }}>
          {data?.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
```
```ts
//App.ViewModel.ts
class AppViewModel extends StoreViewModel {
  async  getEmail = (search?: string): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Mock.mock({ 'data|5': ['@email'] }).data);
      }, 300);
    });
  }
}
export { AppViewModel  }
```

#### 7、🤔 Question: ViewModel与原来的class component写法有啥区别

Class component业务逻辑分散在组件的各个方法之中，导致重复逻辑或关联逻辑。只能通过hoc或render props的方式复用，代码逻辑复用极差。

ViewModel 只是将函数式组件的方法抽离到单一模块维护，并不限制hooks的使用，任何hooks的代码逻辑依然可以得到复用，只有view对应的业务强相关逻辑会被抽离到vm中进行单独维护，可以重离成hooks的方法依然是鼓励抽出去的，两者并不是互斥的，而是相融的。


#### 8、🤔 Question: 如何规范化前端项目文件呢？

可以通过以下配置，快速生成项目模板。执行如下步骤，可一键生成模板文件：

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
配置的项目模板，可更好统一前端模板代码。实现各个模块分而治之的理念

## API



详情查看👉: [中文文档](https://github.com/hawx1993/hooks-view-model/wiki/Chinese-version-of-hooks-view-model-api)

View detail: 👉[English docs](https://github.com/hawx1993/hooks-view-model/wiki/English-version-of-hooks-view-model-docs)
