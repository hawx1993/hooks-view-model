# @perfma/store-view-model

StoreViewModel是一种通过拆分UI视图与业务逻辑的解决方案，并提供全局与局部state管理；提供全局变量与持久化数据管理；
基于react hooks 实现，通过拆分react 视图和业务逻辑，做到真正的分而治之，View 只负责展示视图，ViewModel 负责状态和数据处理，View 通过 useGlobalStore/useCurrentStore 获取数据并主动更新视图。

<img src="https://media.perfma.net/guitar/image/WBLaY17t9r4rqA4NeKQnX.png" />

由上图可知，顾名思义，ViewModel就是用来处理数据绑定和dom 事件监听的。

### 容器方案：View 和 ViewModel


首先：AppView  视图组件通过useVM实例化AppViewModel，并获取AppViewModel和StoreViewModel的实例方法；
其次：AppView 视图组件通过useGlobalState和useCurrentState获取全局和当前页面状态state，其中：
● useGlobalState 响应来自updateGlobalStateByKey 的更新
● useCurrentState 响应来自updateCurrentState 的更新

>View：获取数据并展示数据

```tsx
// AppView.tsx
import { AppViewModel } from './AppViewModel'
import { useVM } from 'hooks-store-view-model'
import { GLOBAL_KEYS } from 'app/path/to/globalKeys'

const AppView = () => {
  const { changeAddress, useGlobalState } = useVM(AppViewModel, {
    address: '0x000',
  })
  const [viewData] = useGlobalState(GLOBAL_KEYS.View)
  const { address } = viewData

  return (
    <div>
      <button onClick={changeAddress}>click to change address</button>
      <span>{address}</span>
    </div>
  )
}

```

>ViewModel：处理数据，管理状态和数据

updateGlobalStateByKey 和 updateCurrentState 相当于在class中可以使用的setState方法，只不过需要保证class中的所有方法都是箭头函数，否则会报错

```tsx
// AppViewModel.ts
import  StoreViewModel from 'hooks-store-view-model'
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


