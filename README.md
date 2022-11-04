# hooks-view-model

[中文文档]([./README.zh-cn.md](https://github.com/hawx1993/hooks-view-model/wiki/hooks-view-model-api-%E6%96%87%E6%A1%A3))

<p align="center">
  <img src="https://img.shields.io/github/license/hawx1993/hooks-view-model" />
  <img src="https://img.shields.io/github/stars/hawx1993/hooks-view-model" /> 
  <img src="https://img.shields.io/github/forks/hawx1993/hooks-view-model" /> 
  <img src="https://img.shields.io/github/issues/hawx1993/hooks-view-model" />
</p>


`hooks-view-model` is a solution by decouple UI view and business logic for react hooks. Using `hooks-view-model` will bring the following conveniences:

- 💼 Provide global and local state management without introducing state management solutions such as reducer or redux;
- 🌲 Provide global cache and persistent data storage management;
- 🎩 The introduction of this solution into business code will make the business code more organized, maintainable and testable, with clearer division of responsibilities, and avoid problems such as reduced component maintainability and chaotic data processing caused by the combination of spaghetti-style writing.
- 🍰 Effectively avoid the problem of too much state in the component that needs to be managed, and simplify the writing of useState and setState in the form of objects.
- 🍷 Compared with the native useState hooks, the data is clearer and easier to debug. You can enter `globalStore` in the console to view all state storage information
- 👋 Can achieve global data update, cross-component data transfer, without `useReducer` or context
- 🌲 Different stores are divided according to the key, and the view component will not respond to the state change of the unused store, which can cancel the performance overhead.
- 🍳 ViewModel will provide basic life cycle functions without frequently introducing useEffect in hooks components for processing
- 🍖 ViewModel will automatically trigger memory recycling according to the life cycle of react hooks, and memory management is more planned
- 🥒 Since the function has already been extracted into the ViewModel, there is no need to use `useCallback` to deal with the component re-rendering problem caused by the change of function reference.


Based on the implementation of `react hooks`, by splitting the react view and business logic, a real divide and conquer is achieved. View is only responsible for displaying views, ViewModel is responsible for state and data processing, and View obtains data through `useGlobalStore/useCurrentStore` and actively updates the view.

<img src="https://media.perfma.net/guitar/image/WBLaY17t9r4rqA4NeKQnX.png" />


Based on `hooks-view-model`, there is no need for useCallback, no need for useReducer, no need for technical solutions such as redux. `hooks-view-model` is a solution that integrates state management, variable storage management and persistent data management.
### Quick Start

1、install：
```bash
$ yarn add hooks-view-model
```

2、import

```ts
import StoreViewModel, { useVM } from 'hooks-view-model'
```
### Why develop this solution?

Because the writing style of the functional hooks component is too loose, it is easy to write spaghetti-style code that is difficult to maintain over time. In order to standardize the writing style of the component style of different departments, all business logic is unified in the viewModel for processing.

1. With this solution there is no need for hooks?
  
That is definitely not the case. Other public hooks can still be used, but the logic that is strongly related to the business and cannot be separated is recommended to be written in the ViewModel. The hooks can still be introduced in functional components, and the returned value can be passed to the useVM. ViewModel to handle

### View and  ViewModel


First: The AppView view component instantiates the AppViewModel through useVM, and obtains the instance methods of `AppViewModel` and `StoreViewModel`;

Second: the AppView view component gets the global and current page state state through `useGlobalState` and `useCurrentState`, where:

- `useGlobalState` responds to updates from `updateGlobalStateByKey`
- `useCurrentState`  responds to updates from `updateCurrentState` 

>View：Get data and display data

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

>ViewModel：Manage data, manage state and data

`updateGlobalStateByKey` and  `updateCurrentState` It is equivalent to the setState method that can be used in the class, but it is necessary to ensure that all methods in the class are arrow functions, otherwise an error will be reported

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

### Common State Manage

- All APIs related to the beginning of update are common APIs for view and viewModel;
- All APIs starting with use are view-exclusive APIs;That it's hooks;

#### updateGlobalStateByKey

Update global state by key

param：
- key：to keep the key unique, use enumeration values
- value: the state value to update

>Examples

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

- Update the state of the current view, applicable to view and viewModel
- Automatically bind the name of the current viewModel as the key, no need to pass in the key

param:
- value：state value to update

>Examples

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

Get global state by key, applicable to view and viewModel
#### getCurrentState()

Get current state, view and viewModel apply

```tsx
import StoreViewModel from 'hooks-view-model';

class HeaderViewModel extends StoreViewModel<any> {
  changeModule = () => {
     const { tableData } = this.getCurrentState();
  }
}
export { HeaderViewModel };
```

#### removeGlobalStateByKey

- Remove global state by key, applicable to view and viewModel;
- GlobalState will not be automatically recycled when the component is unmounted, consistent with reducer or redux


#### getGlobalStateByKeys([])
 
Get global state values ​​in batches through the keys array
### cache Store

- The essence is an object instantiated through new map() and stored in memory
- Component unloading will still exist, refresh the page or close the page, the variable is released`


#### updateGlobalStore

Update global variable storage by key

>Examples

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

- Get global variable storage by key
- When it exists, it returns the correct value; when it does not exist, it returns undefined


#### removeGlobalStoreByKey

- Remove global variable storage by key, return boolean

## Persistent storage 

PersistStore is essentially stored in localstorage, and localstorage is valid for permanent unless manually deleted
#### updateGlobalPersistStore

Update global persistent storage

param：
- key：key to update
- value：value to update


>Examples

```tsx

class FooterViewModel extends StoreViewModel<any> {

  updateLocalValue = () => {
    this.updateGlobalPersistStore('local_value', { name: 'huang', age: 123 });
  };

}
export { FooterViewModel };
```


#### getGlobalPersistStoreByKey

Obtain data in global persistent storage by key

>Examples


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

Remove global persistent storage by key

Return value: boolean
  - true : Indicates the deletion was successful
  - false : Indicates that deletion failed


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

- Similar to useState hooks, get the state corresponding to the global view, only for view
- Respond to updates from updateGlobalStateByKey


param：
- key：The key corresponding to the state to be obtained
- initialState：Initialize state, similar to the default value of useState

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

- hooks, get the state corresponding to the current view, only for view
- Respond to updates from updateCurrentState

param：
- initialState: initialize state, similar to the default value of useState
  
Usage: same as above

#### useVM

- hooks, instantiate ViewModel, view can obtain all public APIs of corresponding ViewModel and StoreViewModel by calling useVM;
- Execute the mounted lifecycle hook when the component is mounted; execute the unmounted lifecycle hook when the component is unmounted;
- Assign the latest props to viewModel, viewModel can get the latest props through this.props.xxx
  
param：
- viewModel
- props: the parameters passed by the view to the viewModel, and the ViewModel is accessed through this.props

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


### lifecycle hooks

#### mounted

When the component is mounted, the ViewModel will automatically execute this method, and there is no need to introduce useEffect in the view to execute the related lifecycle api.

mounted is equivalent to componentDidMount of viewModel

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

When the component is unmounted, the ViewModel will automatically execute this method

```tsx
import StoreViewModel from 'hooks-view-model';

class HeaderViewModel extends StoreViewModel<any> {
  unmounted = () => {
    console.log('app will autorun when component unmounted')
  }
}
export { HeaderViewModel };
```

#### onPropsChange

which will be called when new props are received;

parameter: props

```tsx
// Counter.View.tsx
const Counter = (props: any) => {
  const { updateCount, useCurrentState } = useVM(CounterViewModel, {
    ...props,
  });
  const { count }  = useCurrentState({ count: 0 });
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
  onPropsChange = (props: any) => {
    console.log('Called automatically when new props are changed', props);
  };

}
export { CounterViewModel };
```
