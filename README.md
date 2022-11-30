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
  - [Introduction](#introduction)
  - [Comparison with hooks](#comparison-with-hooks)
  - [Installation](#installation)
  - [Generate template](#generate-template)
  - [When to use this library](#when-to-use-this-library)
  - [When not to use this library](#when-not-to-use-this-library)
  - [Example](#example)
  - [Documentation](#documentation)
  - [Q \& A](#q--a)

## Introduction

[中文文档](./README.zh-cn.md)

`hooks-view-model` is an intuitive solution to separate UI from business logic.

Based on the `hooks-view-model, you don't have to worry about the closure problem and the above-mentioned hooks problem. `hooks-view-model` is born to solve state management, memory storage, and persistent data. Using `hooks-view-model` will bring the following conveniences:

- 💼 Provide global and local state management, without introducing reducer or redux and other state management solutions;
- 🌲 Provide global cache and persistent data storage management;
- 🎩 It can make the business code more organized, maintainable and testable, and the division of responsibilities is clearer.
- 🍰 Effectively avoid the problem of too many states that need to be managed inside the component, and simplify the useState and setState writing methods in the form of objects.
- 🍷 There is no need to care about hooks inside the class-based ViewModel, so you can focus more on business logic development.
- 👋 It can realize global data update and cross-component data transfer without `useReducer` or context
- 🌲 Different stores are divided according to the key, the view component will not respond to the state changes of the unused stores, and the performance overhead can be canceled
- 🍳 ViewModel will provide basic lifecycle functions, which is more convenient than useEffect to handle asynchronous functions
- 🍖 ViewModel will automatically trigger memory recycling according to the life cycle of react hooks, and memory management is more efficient
- 🥒 No need to use `useCallback` to deal with component re-rendering problems caused by avoiding function reference changes.
- 🍰 After calling the updater to update, the latest state value can be obtained synchronously
- 👋 It can realize fine-grained update of the attribute value of the object, and can realize immutable data

<img src="https://media.perfma.net/guitar/image/WBLaY17t9r4rqA4NeKQnX.png" />

## Comparison with hooks

`hooks-view-model` is mainly used to separate UI and business logic, which can solve some of the problems caused by the official react hooks.

| hooks component issues | hooks-view-model |
| --- | --- |
| useState is difficult to use, if there are many states, you need to maintain them one by one, not concise enough | can update and deconstruct data in the form of objects, simple to write |
| useReducer + context global state is difficult to use, still need to define a lot of action type, also need to provide provider, using useReducer cross-component sharing state is very troublesome | global state update just use `useGlobalState` hooks, usage is simple |
| Life cycle requires the introduction of useEffect, which needs to be managed manually and is not semantic enough | Provide mounted and unmounted hooks, which can be executed automatically and are semantic friendly |
| The business components based on hooks, internal methods are still difficult to do reuse, should be separated out and maintained separately | class writing can be achieved through inheritance reuse, but also through the `useVM` to introduce other viewModel reuse, reusability is high |
| class provides `onPropsChanged` hook function, can be automatically triggered to execute |
| When components reach a certain level of complexity, the stacked code becomes increasingly difficult to maintain | UI and logic are well separated, and the code is well organized
| React Hook's closure trap problem | Since the methods are maintained in the class, there is no such problem |
| useState can't get the latest state value after calling updater | can get the latest value by calling getCurrentState
| call useState updater can't update object property value at fine granularity, need to overwrite after shallow copy object | can updateImmerState at fine granularity |
| call useState updater can't implement immutable data, even memo wrapped subcomponents will be re-rendered | can implement immutable data by updateImmerState, won't re-render subcomponents |

## Installation

```ts
$ yarn add hooks-view-model
```

## Generate template

you can generate project template by the following steps:

1、add generate scripts to `package.json`
```bash
scripts: {
  "generate": "plop --plopfile ./node_modules/hooks-view-model/generators/index.js"
}
```
2、create `template.config.js` to the root directory:

```bash
const dir_to_generate = './src/pages/';

module.exports = dir_to_generate;
```
## When to use this library

1. When your business project is very complex, you need to consider separating UI and business logic
2. When you are working in a team and you want to unify the team members in a consistent style
3. When you want to solve the above hooks defects or confusion caused by closures in the project
## When not to use this library

1. If you don't interesting with the `class` style (try this one: [use-better-state](https://github.com/hawx1993/use-better-state))
2. Your project is a component library
3. Your project has not involved in the complex business logic
## Example

`Counter.View.tsx`

```tsx
// Counter.View.tsx
import { CounterViewModel } from './Counter.ViewModel'
import { useVM } from 'hooks-view-model'

const CounterView = () => {
  const {  useCurrentState, increment, changeUseAge } = useVM(CounterViewModel, {
    count: 0, // as props passed to CounterViewModel
  })
  const { user , count } = useCurrentState( user: { name: 'nilu', age: 0});
  console.log('user', user);// {name: 'nilu', age: 10}
  return (
    <div>
      <button onClick={increment}>click to count</button>
      <button onClick={changeUseAge}>click to change user age</button>
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
    const { count } = this.props;// access data from this.props that passed from useVM
    updateCurrentState({ count: count + 1 });
  };
  changeUseAge = () => {
    this.updateImmerState((draft) => {
      draft.user.age = 10;
    })
  }
  mounted = async () => {
    await someAsyncRequest();// auto run just when componentDidMount
  }
  unmounted = () => {
    window.removeEventListener('');// auto run just when componentWillUnmount
  }
}
export { CounterViewModel } 
```


## Documentation

For additional information, guides and api reference visit :

[English Api docs](https://github.com/hawx1993/hooks-view-model/wiki/English-version-of-hooks-view-model-docs) |
[中文Api文档](https://github.com/hawx1993/hooks-view-model/wiki/Chinese-version-of-hooks-view-model-api)


## Q & A

for more question and answer, please visit [Q & A](./QA.md)