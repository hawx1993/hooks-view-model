# hooks-view-model

<p align="center">
  <img src="https://img.shields.io/github/license/hawx1993/hooks-view-model" />
  <img src="https://img.shields.io/github/stars/hawx1993/hooks-view-model" /> 
  <img src="https://img.shields.io/github/forks/hawx1993/hooks-view-model" /> 
  <img src="https://img.shields.io/github/issues/hawx1993/hooks-view-model" />
</p>


`hooks-view-model`是一种通过拆分UI视图与业务逻辑的解决方案，使用hooks-view-model将带来如下诸多便利：

- 💼 提供全局与局部state管理，无需引入reducer或redux等状态管理方案；
- 🌲 提供全局缓存与持久化数据存储管理；
- 🎩 业务代码引入该方案，将使业务代码更具有可组织性，可维护性和可测试性，职责划分更清晰，避免面条式写法杂糅一起造成的组件维护性下降，数据处理混乱等问题的出现。
- 🌂 即使多次更新state，state未改变，view也不会`re-render`，无需手动处理性能优化
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
### 为什么要研发这个解决方案？

因为基于函数式的hooks组件的写法太过于宽松，久而久之容易写出面条式难以维护的代码， 为了统一规范化不同部门的组件化风格的写法，将所有业务逻辑统一放viewModel中去处理。

有了这个解决方案，就不需要hooks了吗？

那肯定不是，其他可公用的hooks依然可以继续使用，只不过业务强相关的没法抽离的逻辑推荐写到ViewModel中，hooks依然可以在函数式组件用引入，返回的值可通过useVM传递给ViewModel去处理

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


## API

### 通用state状态存储

- 所有update开头相关的API均为view和viewModel通用的api；
- 所有use开头的api均为view独享api；
- updatexxxState本质是useState的updater

#### updateGlobalStateByKey

通过key更新全局state

参数：
- key：为了保持key的唯一性，请使用枚举值
- value：要更新的状态值

>例子Examples

```tsx
type GLOBAL_KEYS =  {
  APP = 'APP'
}
type HeaderVMProps = {
  count: number
}

```
```tsx
import StoreViewModel from 'hooks-view-model';
import { GLOBAL_KEYS, HeaderVMProps } from './types'

class HeaderViewModel extends StoreViewModel<HeaderVMProps> {
  updateCount = (count) => {
    this.updateGlobalStateByKey(GLOBAL_KEYS.APP, {
      count,
    });
  };
}
```
#### updateCurrentState

- 更新当前view的state，view 和 viewModel 适用
- 自动绑定当前viewModel的name作为key，无需传入key

参数:
- value：要更新的状态值

>例子Examples

```tsx
import StoreViewModel from 'hooks-view-model';

class HeaderViewModel extends StoreViewModel<any> {
  updatePersonInfo = (person: {
    name: string;
    age?: number;
    height?: number;
  }) => {
    this.updateCurrentState({
      person,
    });
  };
  changeHeaderData = (count) => {
    this.updateCurrentState({
      headCount: count,
    });
  };
}
export { HeaderViewModel };
```

#### getGlobalStateByKey(key)

通过key获取全局state，view和viewModel 适用

#### getCurrentState()

获取当前state，view和viewModel 适用
```tsx
import StoreViewModel from 'hooks-view-model';

class HeaderViewModel extends StoreViewModel<any> {
  changeModule = () => {
     const { tableData } = this.getCurrentState();
  }
}
export { HeaderViewModel };
```

#### getGlobalStateByKeys([])
 
通过keys数组批量获取全局状态值

### Store 内存存储

- 本质是通过new map()实例化的对象，存储在内存中
- `组件卸载仍会存在，刷新页面或关闭页面，该变量释放`


#### updateGlobalStore

通过key 更新全局变量存储

>例子Examples

```tsx
class FooterViewModel extends StoreViewModel<any> {
  updateCount = count => {
    this.updateCurrentState({
      count,
    });
  };
  updateModalState = () => {
    this.updateGlobalStore('modal_close', true);
  };
  updateLocalValue = () => {
    this.updateGlobalPersistStore('local_value', { name: 'huang', age: 123 });
  };
  removeLocalValue = () => {
    const removed = this.removeGlobalPersistStoreByKey('local_value');
    console.log('removed', removed);
  };
  mounted = () => {
    console.log('mounted123');
  };
}
export { FooterViewModel };
```

#### getGlobalStoreByKey

- 通过key获取全局变量存储
- 存在时，返回正确的值；不存在时，返回undefined



#### removeGlobalStoreByKey

- 通过key 移除全局变量存储，返回布尔值

### 持久化存储localStorage

PersistStore 本质是存储在localstorage，localStorage有效期为永久，除非手动删除

#### updateGlobalPersistStore

更新全局持久化存储

参数：
- key：要更新的键
- value：要更新的值


>例子Examples

```tsx

class FooterViewModel extends StoreViewModel<any> {

  updateLocalValue = () => {
    this.updateGlobalPersistStore('local_value', { name: 'huang', age: 123 });
  };

}
export { FooterViewModel };
```


#### getGlobalPersistStoreByKey

通过key获取全局持久化存储的数据

>例子Examples


```tsx
import { useVM } from 'hooks-view-model';

export default function Footer() {
  const {
    useCurrentState,
    getGlobalPersistStoreByKey,
  } = useVM(FooterViewModel, {});;
  const { count } = useCurrentState({
    count: 0,
  });

  return (
    <div style={{ border: '1px solid red' }}>
      <p>count: {getGlobalPersistStoreByKey('local_value')}</p>
    </div>
  );
}
```

#### removeGlobalPersistStoreByKey

通过key移除全局持久化存储
返回值：布尔值
  - true 表示删除成功
  - false 表示删除失败


```tsx
class FooterViewModel extends StoreViewModel<any> {
  removeLocalValue = () => {
    const removed = this.removeGlobalPersistStoreByKey('local_value');
    console.log('removed', removed);
  };

}
export { FooterViewModel };

```

### hooks

#### useGlobalState

- 类似useState  hooks，获取全局 view 对应的state，仅view 适用
- 响应来自updateGlobalStateByKey的更新


参数：
- key：要获取的state对应的key
- initialState：初始化state，类似useState默认值

```tsx
import { useVM } from 'hooks-view-model';
import { AppViewModel } from './App.ViewModel.ts';

export default function App() {
 const {
    useGlobalState,
  } = useVM(AppViewModel, {});
  const { count } = useGlobalState(GLOBAL_KEYS.APP, { count: 0 });
  return <div>{count}</div>
}
```
#### useCurrentState

- hooks，获取当前view 对应的state，仅view 适用
- 响应来自updateCurrentState的更新

参数：
- initialState：初始化state，类似useState默认值

用法：上同

#### useVM
- hooks，实例化ViewModel，view通过调用useVM，可获取对应的ViewModel和StoreViewModel的所有public API；
- 在组件挂载时执行mounted生命周期钩子；在组件卸载时 执行unmounted 生命周期钩子；
- 当接收新的props时，自动执行onReceiveProps方法
- 将最新的props赋值给viewModel，viewModel 可通过this.props.xxx 获取最新的props

参数：
- viewModel
- props：view传递给viewModel的参数，ViewModel通过this.props访问


```tsx
import  {  useVM } from 'hooks-view-model';

export default function Footer() {
  const {
    updateModalState,
    getGlobalStoreByKey,
    updateLocalValue,
    getGlobalPersistStoreByKey,
    removeLocalValue,
    useCurrentState
  } = useVM(FooterViewModel, {name: 'pefma', value: 'value'});
  const { count }  = useCurrentState({
    count: 0,
  });
  const [num, setNum] = useState(0);
  return (
    <div style={{ border: '1px solid red' }}>
      <p>count: {count}</p>
      <button onClick={() => updateCount(10)}>+</button>
      <button onClick={updateModalState}>updateGlobalStore</button>
      <button onClick={updateValue}>updateValue</button>
      <button onClick={updateLocalValue}>updateLocalValue</button>
      <button onClick={removeLocalValue}>removeLocalValue</button>
    </div>
  );
}
```


### 生命周期钩子

#### mounted

组件挂载的时候，ViewModel 会自动执行该方法，无需在view中引入useEffect执行相关生命周期api。
mounted相当于是viewModel的componentDidMount

```tsx
import StoreViewModel from 'hooks-view-model';

class HeaderViewModel extends StoreViewModel<any> {
  mounted = () => {
    console.log('app will autorun when component mounted')
  }
}
export { HeaderViewModel };
```

#### unmounted

组件卸载的时候，ViewModel 会自动执行该方法

```tsx
import StoreViewModel from 'hooks-view-model';

class HeaderViewModel extends StoreViewModel<any> {
  unmounted = () => {
    console.log('app will autorun when component unmounted')
  }
}
export { HeaderViewModel };
```

#### onReceiveProps

接收新的props时触发，参数：props

```tsx
// Counter.View.tsx
const Counter = (props: any) => {
	// 当传递给CounterViewModel的props发生变化时，onReceiveProps 会自动执行
  const { updateCount, useCurrentState } = useVM(CounterViewModel, {
    props,
  });
  const { count } = useCurrentState({ count: 0 });
  return (
    <div>
      <div>Count is {count}</div>
      <button onClick={() => updateCount(count + 1)}>count</button>
      <div></div>
    </div>
  );
};

export { Counter };

```

```tsx
// Counter.ViewModel.ts
import StoreViewModel from 'hooks-view-model';

class CounterViewModel extends StoreViewModel<any> {
  constructor(props) {
    super(props);
  }
  updateCount = count => {
    this.updateCurrentState({
      count,
    });
  };
  getCount = () => {
    const count = this.getCurrentState();
    return count
  }
  updateModalState = () => {
    this.updateGlobalStore('modal_close', true);
  };
  updateLocalValue = () => {
    this.updateGlobalPersistStore('local_value', { name: 'huang', age: 123 });
  };
  removeLocalValue = () => {
    const removed = this.removeGlobalPersistStoreByKey('local_value');
    console.log('removed', removed);
  };
  onReceiveProps = (props: any) => {
    console.log('接收新的props时自动触发', props);
  };

}
export { CounterViewModel };
```
