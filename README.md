# @perfma/store-view-model

无需基于任何第三方状态管理工具，即可做到拆分 View 和 View logic，做到真正的分而治之，View 只负责展示视图，ViewModel 负责处理状态和数据，View 通过 `useGlobalStore/useCurrentStore` 获取数据并主动更新视图。

<img src="https://media.perfma.net/guitar/image/WBLaY17t9r4rqA4NeKQnX.png" />

由上图可知，顾名思义，ViewModel就是用来处理数据绑定和dom 事件监听的。

### 容器方案：View 和 ViewModel


基于 StoreViewModel，很好的分离 UI 与数据逻辑处理，做到各司其职，一个 View 对应一个 ViewModel，View 可以响应 ViewModel 的数据更新，通过 state 的形式 render 到 hooks 组件上。

每个 ViewModel 通过继承 StoreViewModel，可以获取 StoreViewModel 对应的 api。

View 通过 useVM，把对应的 ViewModel 和 props 作为参数传入，View 可获得 ViewModel 和 StoreViewModel 的方法。

> 实例如下：

View Component:

```ts
// View.tsx
import { ViewModel } from './ViewModel'
import { useVM } from '@perfma/store-view-model'
import { GLOBAL_KEYS } from 'app/path/to/globalKeys'

const View = () => {
  const { changeAddress, useGlobalStore } = useVM(ViewModel, {
    address: '0x000',
  })
  const [viewData] = useGlobalStore(GLOBAL_KEYS.View)
  const { address } = viewData

  return (
    <div>
      <button onClick={changeAddress}>click to change address</button>
      <span>{address}</span>
    </div>
  )
}
```

ViewModel:

```ts
// ViewModel.ts
import { StoreViewModel } from '@perfma/store-view-model'
import { GLOBAL_KEYS } from 'app/path/to/globalKeys'

class ViewModel extends StoreViewModel {
  updateViewStore = <T>(value: T) => {
    this.updateStoreByKey(GLOBAL_KEYS.View, value)
  }
  changeAddress = () => {
    this.updateViewStore(this.props.address)
  }
}
```

### API

- `updateGlobalStoreByKey(key, value)`：根据指定的key，更新全局store；主要用于 `ViewModel`，hooks也可使用，规范上来说不推荐
- `updateCurrentStore(value)`：无需指定key，即可更新当前view对应的store；主要用于 `ViewModel`，hooks也可使用，规范上来说不推荐
- `useGlobalStore(key, initialState?)`：根据指定的key，响应`updateGlobalStoreByKey` 的更新；主要用于hooks中

```tsx
const [viewData, updateAge] = useGlobalStore('testKey', {name: 'testValue', age: 18})

updateAge({
  age: 30
})
console.log(viewData) // {name: 'testValue', age: 18}
```

- `useCurrentStore(initialState?)`：获取当前的store，响应`updateCurrentStore` 的更新，可传入初始状态，类似`useState(false)`；主要用于hooks中
- `getGlobalStoreByKey(key)`：根据指定的key获取全局store，主要用于`ViewModel`，hooks也可使用，规范上来说不推荐
- `getCurrentStore`：获取当前store，无需指定key，主要用于`ViewModel`，hooks也可使用，规范上来说不推荐
- `useVM(ViewMode, props)`: 传入ViewModel和props，返回`ViewModel`和`StoreViewModel`所有public api，同时将props 传递给ViewModel，由ViewModel处理相关数据

```tsx
const {useGlobalStore, updateCurrentStore, otherViewModelApi} = useVM(ViewMode, {});
```

补充api：

- getGlobalStoreByKeys([...keys])：由一组key组成的数组，获取指定的全局store，主要用于`ViewModel`，hooks也可使用，规范上来说不推荐


> 本地状态调试：

打开 Chrome 控制台，输入 globalStore，即可查看全局状态和当前view 对应的状态：

<img src="https://media.perfma.net/guitar/image/aY3h_ZGX5iPGZz_1fyvMa.jpg" />

**可见的特点或优势如下：**

1、代码更具有可组织性，可维护性和可测试性，职责划分更清晰

2、ViewModel的本意是逻辑处理，state状态处理，不需要频繁的做拆分，View与ViewModel是绑定的关系，一一对应的关系

3、基于hooks实现，无需引入第三方库，依托class和react hooks实现，低学习成本

4、View可以响应ViewModel触发的状态变化

5、依据key划分不同store，view组件不会响应未使用到的store的状态变化，可解约性能开销

6、即使多次更新state，state未改变，view也不会re-render

7、有效避免组件内部太多state需要管理的问题，以对象形式简化useState，setState写法。

8、写成类的形式，方便在各个ViewModel实现继承，需要被继承viewModel可抽离成单个vm

9、还可以使用useVM，来复用其他ViewModel的方法。

10、现有ViewModel 仍然可兼容state hooks的实现方式，可在UI层引入需要复用的hooks，hooks返回的数据可作为props传递给ViewModel，不存在复用性差的情况

11、相较于原生的useState hooks，数据清晰，更方便debug

12、可实现全局数据更新，跨组件数据通信，无需useReducer

 -   useReducer本质也是useState的替代方案，它接收一个形如 `(state, action) => newState` 的 reducer，并返回当前 `state` 以及与之配套的 `dispatch` 方法
 -   useReducer 使用起来更加麻烦，需要在顶层组件包裹Provider，需要配置各种action type
