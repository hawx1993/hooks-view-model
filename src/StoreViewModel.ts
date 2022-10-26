import { SetStateAction, useState, Dispatch, useEffect } from 'react';
import isEqual from 'react-fast-compare';

const INCOMING_STORE_KEY = 'INCOMING_STORE_KEY';
type StateUpdater<ValueType> = (value: ValueType) => void;

const globalState = new Map();
const currentState = new Map();
const globalStore = new Map();
const incomingStore = new Map();

enum STORE_TYPE {
  GLOBAL_STORE = 'global_store',
  CURRENT_STORE = 'current_store',
}
// TODO: add useLocalStore for persist data
type StoreViewModelProps = {
  vmName: string;
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
  private _setStoreValue = <K, ValueType>(
    key: K,
    type: STORE_TYPE,
    defaultValue?: ValueType,
  ) => {
    if (type === STORE_TYPE.CURRENT_STORE) {
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
    this._setStoreValue(key, type, defaultValue);
    if (type === STORE_TYPE.CURRENT_STORE) {
      return currentState.get(key);
    }
    return globalState.get(key);
  };
  private _updateCurrentStoreValue = <K, ValueType>(
    key,
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
    if (isEqual(current.value, value)) return;
    if (type === STORE_TYPE.CURRENT_STORE) {
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
  // 根据key全局更新store
  public updateGlobalStateByKey = <K, ValueType = any>(
    key: K,
    incomingValue: ValueType,
  ) => {
    const lastIncomingValue = incomingStore.get(INCOMING_STORE_KEY);
    // if (!isEqual(lastIncomingValue, incomingValue)) {
    //   incomingStore.set(INCOMING_STORE_KEY, incomingValue);
    // } else {
    //   return;
    // }
    this._updatedStateValue<K, ValueType>(
      key,
      incomingValue,
      STORE_TYPE.GLOBAL_STORE,
    );
    this._emitUpdate<K, ValueType>(key, STORE_TYPE.GLOBAL_STORE);
  };
  private _cleanStore = (store, key) => {
    try {
      console.info(`cleaning ${key} currentStore...`, store);
      store.delete(key);
      store.size === 0
        ? console.info(`cleaning ${key} store done`)
        : console.warn('clean failed');
    } catch (error) {
      console.error('cleaning ${key} store failed!', error.message);
    }
  };
  private _getStateUpdater = <K, ValueType>(
    key: K,
  ): StateUpdater<ValueType> => {
    return (incomingValue: ValueType) => {
      this.updateGlobalStateByKey<K, ValueType>(key, incomingValue);
    };
  };
  // updateStoreByKey
  public updateCurrentState = <ValueType = any>(incomingValue: ValueType) => {
    const key = this.props.vmName;
    const lastIncomingValue = incomingStore.get(INCOMING_STORE_KEY);
    // if (!isEqual(lastIncomingValue, incomingValue)) {
    //   incomingStore.set(INCOMING_STORE_KEY, incomingValue);
    // } else {
    //   return;
    // }
    this._updatedStateValue<typeof key, ValueType>(
      key,
      incomingValue,
      STORE_TYPE.CURRENT_STORE,
    );
    this._emitUpdate<typeof key, ValueType>(key, STORE_TYPE.CURRENT_STORE);
  };

  public useGlobalState = <K, State>(key: K, initialState?: State) => {
    this._setDefaultValue(key, STORE_TYPE.GLOBAL_STORE, initialState);
    const current = this._getStoreValue(
      key,
      STORE_TYPE.GLOBAL_STORE,
      initialState,
    );
    const state = useState(current.value);
    const listeners = {} as any;
    globalState.forEach((value, key: K) => {
      listeners[key] = new Set();
    });
    useEffect(() => {
      const cleanup = () => {
        this._cleanStore(globalState, key);
      };
      return cleanup;
    }, []);
    current.updaters.add(state[1]);
    return [current?.value || {}, this._getStateUpdater(key)];
  };

  // useGlobalStore
  public useCurrentState = <State>(initialState?: State) => {
    const key = this.props.vmName;
    this._setDefaultValue(key, STORE_TYPE.CURRENT_STORE, initialState);
    const current = this._getStoreValue(
      key,
      STORE_TYPE.CURRENT_STORE,
      initialState,
    );
    const state = useState(current.value);
    const listeners = {} as any;
    currentState.forEach((value, curKey: typeof key) => {
      listeners[curKey] = new Set();
    });
    useEffect(() => {
      const cleanup = () => {
        this._cleanStore(currentState, key);
      };
      return cleanup;
    }, []);
    current.updaters.add(state[1]);
    return [current?.value || {}, this._getStateUpdater(key)];
  };

  public getGlobalStateByKey = <K>(key: K) => {
    const current = globalState.get(key);
    return current?.value || {};
  };
  public getCurrentState = () => {
    const curKey = this.props.vmName;
    const current = currentState.get(curKey);
    return current?.value || {};
  };
  // public batchUpdateGlobalStore = <K>(payload: { key: K; value: any }[]) => {
  //   payload.forEach((item) => {
  //     this.updateGlobalStoreByKey(item.key, item.value);
  //   });
  // };

  public getGlobalStateByKeys = <K>(keys: K[]) => {
    return keys.map((item) => {
      const current = globalState.get(item);
      return current?.value || {};
    });
  };
  // store manage 变量存储
  public updateGlobalStore = <K, V>(key: K, value: V) => {
    if (!globalStore.has(key)) {
      globalStore.set(key, value);
    } else {
      console.error(key + ' already exists');
    }
  };
  public getGlobalStoreByKey = <K>(key: K) => {
    const value = globalStore.get(key);
    return value;
  };
}

(global as any).globalStore = {
  globalState,
  currentState,
  globalStore,
};

export default StoreViewModel;
