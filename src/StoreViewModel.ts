import { SetStateAction, useState, Dispatch, useEffect } from 'react';
import store from 'store';
import { produce } from 'immer';

const globalState = new Map();
const currentState = new Map();
const globalStore = new Map();
const incomingGlobalState = new Map();
const incomingCurrentState = new Map();

enum STORE_TYPE {
  GLOBAL_STATE = 'global_state',
  CURRENT_STATE = 'current_state',
}
// TODO: add useLocalStore for persist data
type StoreViewModelProps = {
  VM_NAME?: string;
};

class StoreViewModel<P = {}> {
  props: StoreViewModelProps & P;

  constructor(props: StoreViewModelProps & P) {
    this.props = props;
  }
  private _setCurrentStateValue = <K, ValueType>(
    key,
    defaultValue?: ValueType,
  ) => {
    if (!currentState.has(key)) {
      currentState.set(key, {
        value: defaultValue,
        updaters: new Set<Dispatch<SetStateAction<K>>>(),
      });
    }
  };
  private _setGlobalStateValue = <K, ValueType>(
    key,
    defaultValue?: ValueType,
  ) => {
    if (!globalState.has(key)) {
      globalState.set(key, {
        value: defaultValue,
        updaters: new Set<Dispatch<SetStateAction<K>>>(),
      });
    }
  };
  private _setStateValue = <K, ValueType>(
    key: K,
    type: STORE_TYPE,
    defaultValue?: ValueType,
  ) => {
    if (type === STORE_TYPE.CURRENT_STATE) {
      this._setCurrentStateValue(key, defaultValue);
    } else {
      this._setGlobalStateValue(key, defaultValue);
    }
  };

  private _getStoreValue = <K, ValueType>(
    key: K,
    type: STORE_TYPE,
    defaultValue?: ValueType,
  ) => {
    this._setStateValue(key, type, defaultValue);
    if (type === STORE_TYPE.CURRENT_STATE) {
      return currentState.get(key);
    }
    return globalState.get(key);
  };
  private _updateCurrentStoreValue = <K, ValueType>(
    key: K,
    current,
    value: ValueType,
  ) => {
    currentState.set(key, {
      value: {
        ...current.value,
        ...value,
      },
      updaters: current.updaters,
    });
  };
  private _updateGlobalStoreValue = <K, ValueType>(
    key: K,
    current,
    value: ValueType,
  ) => {
    globalState.set(key, {
      value: {
        ...current.value,
        ...value,
      },
      updaters: current.updaters,
    });
  };
  private _updatedStateValue = <K, ValueType>(
    key: K,
    value: ValueType,
    type: STORE_TYPE,
  ) => {
    const current = this._getStoreValue(key, type);
    if (type === STORE_TYPE.CURRENT_STATE) {
      this._updateCurrentStoreValue(key, current, value);
    } else {
      this._updateGlobalStoreValue(key, current, value);
    }
    current.value = value;
  };

  private _setDefaultValue = <K, ValueType>(
    key: K,
    type: STORE_TYPE,
    value?: ValueType,
  ) => {
    const current = this._getStoreValue(key, type);
    if (current.value === undefined && value !== undefined) {
      this._updatedStateValue(key, value, type);
    }
  };

  private _emitUpdate = <K, ValueType = any>(key: K, type: STORE_TYPE) => {
    const current = this._getStoreValue<K, ValueType>(key, type);
    current.updaters.forEach((listener: Dispatch<SetStateAction<K>>) => {
      listener(current.value);
    });
  };
  // ??????key????????????store
  /**
   * ??????key????????????view ?????????state???view ??? viewModel ??????
   * ?????????updateGlobalStateByKey(key, value)
   */
  public updateGlobalStateByKey = <K, ValueType = any>(
    key: K,
    incomingValue: ValueType,
  ) => {
    this._updatedStateValue<K, ValueType>(
      key,
      incomingValue,
      STORE_TYPE.GLOBAL_STATE,
    );
    this._emitUpdate<K, ValueType>(key, STORE_TYPE.GLOBAL_STATE);
  };
  private _cleanStore = (store, key) => {
    try {
      console.info(`cleaning ${key} currentStore...`, store);
      const success = store.delete(key);
      success
        ? console.info(`cleaning ${key} store done`)
        : console.warn('clean failed');
    } catch (error) {
      console.error('cleaning ${key} store failed!', error.message);
    }
  };
  /**
   * ????????????view???state???view ??? viewModel ??????
   * ?????????updateCurrentState(value)
   */
  public updateCurrentState = <ValueType = any>(incomingValue: ValueType) => {
    const key = this.props.VM_NAME;
    this._updatedStateValue<typeof key, ValueType>(
      key,
      incomingValue,
      STORE_TYPE.CURRENT_STATE,
    );
    this._emitUpdate<typeof key, ValueType>(key, STORE_TYPE.CURRENT_STATE);
  };

  /**
   * hooks??????????????? view ?????????state??????view ??????
   * ?????????useGlobalState(key, initialState?)
   */
  public useGlobalState = <K, State>(key: K, initialState?: State) => {
    this._setDefaultValue(key, STORE_TYPE.GLOBAL_STATE, initialState);
    const current = this._getStoreValue(
      key,
      STORE_TYPE.GLOBAL_STATE,
      initialState,
    );
    const state = useState(current.value);
    const listeners = {} as any;
    globalState.forEach((value, key: K) => {
      listeners[key] = new Set();
    });
    useEffect(() => {
      const cleanup = () => {
        incomingGlobalState.delete(key);
      };
      return cleanup;
    }, []);
    current.updaters.add(state[1]);
    return current?.value || {};
  };

  // useGlobalStore
  /**
   * hooks???????????????view ?????????state??????view ?????????
   * ?????????useCurrentState(initialState)
   */
  public useCurrentState = <State>(initialState?: State) => {
    const key = this.props.VM_NAME;
    this._setDefaultValue(key, STORE_TYPE.CURRENT_STATE, initialState);
    const current = this._getStoreValue(
      key,
      STORE_TYPE.CURRENT_STATE,
      initialState,
    );
    const state = useState(current.value);
    const listeners = {} as any;
    currentState.forEach((value, curKey: typeof key) => {
      listeners[curKey] = new Set();
    });
    useEffect(() => {
      const cleanup = () => {
        incomingCurrentState.delete(key);
        this._cleanStore(currentState, key);
      };
      return cleanup;
    }, []);
    current.updaters.add(state[1]);
    return current?.value || {};
  };
  /**
   * ??????key??????global state???view???viewModel ??????;
   * ?????????getGlobalStateByKey(key)
   */
  public getGlobalStateByKey = <K>(key: K) => {
    const current = globalState.get(key);
    return current?.value || {};
  };
  /**
   * ??????key ??????global state???view???viewModel ??????;
   * ?????????????????????
   */
  public removeGlobalStateByKey = <K>(key: K) => {
    return globalState.delete(key);
  };
  /**
   * ????????????state???view???viewModel ?????????
   * ?????????getCurrentState()
   */
  public getCurrentState = () => {
    const curKey = this.props.VM_NAME;
    const current = currentState.get(curKey);
    return current?.value || {};
  };
  /**
   * ??????keys???????????????????????????
   * ?????????getGlobalStateByKeys([key1,key2])
   */
  public getGlobalStateByKeys = <K>(keys: K[]) => {
    return keys.map((item) => {
      const current = globalState.get(item);
      return current?.value || {};
    });
  };
  // store manage ????????????
  /**
   * ??????key ????????????????????????
   * ?????????updateGlobalStore(key, value)
   */
  public updateGlobalStore = <K, V>(key: K, value: V) => {
    if (!globalStore.has(key)) {
      globalStore.set(key, value);
    } else {
      console.error(key + ' already exists or duplicate function call');
    }
  };
  /**
   * ??????key????????????????????????
   * ?????????getGlobalStoreByKey(key)
   */
  public getGlobalStoreByKey = <K>(key: K) => {
    const value = globalStore.get(key);
    return value;
  };
  /**
   * ??????key ??????????????????????????????????????????
   * ?????????removeGlobalStoreByKey(key)
   */
  public removeGlobalStoreByKey = <K>(key: K): boolean => {
    return globalStore.delete(key);
  };
  // persist store manage
  /**
   * ????????????????????????????????????void
   * ?????????updateGlobalPersistStore(key,value)
   */
  public updateGlobalPersistStore = <K, V>(key: K, value: V): void => {
    if (!store.get(key)) {
      store.set(key, value);
    } else {
      console.error(key + ' already exists or duplicate function call');
    }
  };
  /**
   * ??????key???????????????????????????
   * ?????????getGlobalPersistStoreByKey(key)
   */
  public getGlobalPersistStoreByKey = <K>(key: K) => {
    const value = store.get(key);
    return value;
  };
  /**
   * ??????key???????????????????????????
   * ?????????removeGlobalPersistStoreByKey(key)
   */
  public removeGlobalPersistStoreByKey = <K>(key: K) => {
    if (store.get(key)) {
      store.remove(key);
      return true;
    }
    return false;
  };
  /**
   * ??????immer ?????????????????????view???state???view ??? viewModel ??????;
   * updateImmerState((draft) => void)
   */
  public updateImmerState = (fn: (draftState: any) => void) => {
    const currentState = this.getCurrentState();
    const nextState = produce(currentState, (draftState) => {
      fn(draftState);
    });
    this.updateCurrentState(nextState);
  };
  /**
   * ??????immer ?????????????????????state???view ??? viewModel ??????;
   * updateGlobalImmerState(globalKey, (draft) => void)
   */
  public updateGlobalImmerState = <K>(
    globalKey: K,
    fn: (draftState: any) => void,
  ) => {
    const globalState = this.getGlobalStateByKey(globalKey);
    const nextState = produce(globalState, (draftState) => {
      fn(draftState);
    });
    this.updateGlobalStateByKey(globalKey, nextState);
  };
  /**
   * ??????????????????????????????????????????
   */
  mounted = () => {};

  /**
   * ??????????????????????????????????????????
   */
  unmounted = () => {};

  /**
   * ???????????????props????????????????????????????????????useDeepCompareEffect
   */
  onPropsChanged?(props: P): void;
}

(global as any).globalStore = {
  globalState,
  currentState,
  globalStore,
};

export default StoreViewModel;
