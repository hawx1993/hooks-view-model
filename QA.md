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


#### 3、🤔 Question: 使用hooks抽离业务逻辑不行吗？使用class有何优势？

React 的定位原本就是用于构建用户界面的UI库，用UI库去实现业务逻辑本身就是不合理的。

使用class 可以无需关注useCallback，useState等各种hooks带来的各种麻烦问题，可以更加专注业务逻辑，写起业务逻辑来更加纯粹；

其次，使用class 可以很好解决上述react hooks的问题；

其次，业务逻辑抽离到class中，依然是函数式组件。

class相比于function 天然的具有可组织性，可扩展性(extends)，和可维护性。

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