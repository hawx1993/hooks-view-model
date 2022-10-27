# @perfma/store-view-model

无需基于任何第三方状态管理工具，即可做到拆分 View 和 View logic，做到真正的分而治之，View 只负责展示视图，ViewModel 负责处理状态和数据，View 通过 `useGlobalStore/useCurrentStore` 获取数据并主动更新视图。

<img src="https://media.perfma.net/guitar/image/WBLaY17t9r4rqA4NeKQnX.png" />

由上图可知，顾名思义，ViewModel就是用来处理数据绑定和dom 事件监听的。

### 容器方案：View 和 ViewModel


基于 StoreViewModel，很好的分离 UI 与数据逻辑处理，做到各司其职，一个 View 对应一个 ViewModel，View 可以响应 ViewModel 的数据更新，通过 state 的形式 render 到 hooks 组件上。

每个 ViewModel 通过继承 StoreViewModel，可以获取 StoreViewModel 对应的 api。

View 通过 useVM，把对应的 ViewModel 和 props 作为参数传入，View 可获得 ViewModel 和 StoreViewModel 的方法。

### 相关文档

>详情：https://perfmahz.yuque.com/oar85r/kfrt8s/gm1ehx



