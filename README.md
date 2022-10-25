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

> 本地状态调试：

打开 Chrome 控制台，输入 globalStore，即可查看当前 view 的所有状态.

### 优势

1、不同的 key，数据不会互相影响，store a update， store b 不会更新

2、×xx 数据更新之后，教上次无变化， 则组件不更新

3、可做到细粒度更新，可更新对象单个字段，其他不更新的字段不受影响

4、无需频繁使用 useState 更新对象，所有的数据可通过 useGlobalStore 获取

5、方便调试。可直接在控制台输入 globalStore 即可获取所有状态
