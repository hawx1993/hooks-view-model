import { SetStateAction, useState, Dispatch, useEffect } from 'react';
import isEqual from 'react-fast-compare';

const INCOMING_STORE_KEY = 'INCOMING_STORE_KEY';
type StateUpdater<ValueType> = (value: ValueType) => void;

const globalStore = new Map();
const currentStore = new Map();
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
  private _setCurrentStoreValue = <K, ValueType>(
    key,
    defaultValue?: ValueType,
  ) => {
    if (!currentStore.has(key)) {
      currentStore.set(key, {
        value: defaultValue,
        updaters: new Set<Dispatch<SetStateAction<K>>>(),
      });
    }
  };
  private _setGlobalStoreValue = <K, ValueType>(
    key,
    defaultValue?: ValueType,
  ) => {
    if (!globalStore.has(key)) {
      globalStore.set(key, {
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
      this._setCurrentStoreValue(key, defaultValue);
    } else {
      this._setGlobalStoreValue(key, defaultValue);
    }
  };

  private _getStoreValue = <K, ValueType>(
    key: K,
    type: STORE_TYPE,
    defaultValue?: ValueType,
  ) => {
    this._setStoreValue(key, type, defaultValue);
    if (type === STORE_TYPE.CURRENT_STORE) {
      return currentStore.get(key);
    }
    return globalStore.get(key);
  };

  private _updatedStoreValue = <K, ValueType>(
    key: K,
    value: ValueType,
    type: STORE_TYPE,
  ) => {
    const current = this._getStoreValue(key, type);
    if (isEqual(current.value, value)) return;
    if (type === STORE_TYPE.CURRENT_STORE) {
      currentStore.set(key, {
        value: {
          ...current.value,
          ...value,
        },
        updaters: current.updaters,
      });
    } else {
      globalStore.set(key, {
        value: {
          ...current.value,
          ...value,
        },
        updaters: current.updaters,
      });
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
      this._updatedStoreValue(key, value, type);
    }
  };

  private _emitUpdate = <K, ValueType = any>(key: K, type: STORE_TYPE) => {
    const current = this._getStoreValue<K, ValueType>(key, type);
    current.updaters.forEach((listener: Dispatch<SetStateAction<K>>) => {
      listener(current.value);
    });
  };
  // 根据key全局更新store
  public updateGlobalStoreByKey = <K, ValueType = any>(
    key: K,
    incomingValue: ValueType,
  ) => {
    const lastIncomingValue = incomingStore.get(INCOMING_STORE_KEY);
    // if (!isEqual(lastIncomingValue, incomingValue)) {
    //   incomingStore.set(INCOMING_STORE_KEY, incomingValue);
    // } else {
    //   return;
    // }
    this._updatedStoreValue<K, ValueType>(
      key,
      incomingValue,
      STORE_TYPE.GLOBAL_STORE,
    );
    this._emitUpdate<K, ValueType>(key, STORE_TYPE.GLOBAL_STORE);
  };

  private _getStateUpdater = <K, ValueType>(
    key: K,
  ): StateUpdater<ValueType> => {
    return (incomingValue: ValueType) => {
      this.updateGlobalStoreByKey<K, ValueType>(key, incomingValue);
    };
  };
  // updateStoreByKey
  public updateCurrentStore = <ValueType = any>(incomingValue: ValueType) => {
    const key = this.props.vmName;
    const lastIncomingValue = incomingStore.get(INCOMING_STORE_KEY);
    // if (!isEqual(lastIncomingValue, incomingValue)) {
    //   incomingStore.set(INCOMING_STORE_KEY, incomingValue);
    // } else {
    //   return;
    // }
    this._updatedStoreValue<typeof key, ValueType>(
      key,
      incomingValue,
      STORE_TYPE.CURRENT_STORE,
    );
    this._emitUpdate<typeof key, ValueType>(key, STORE_TYPE.CURRENT_STORE);
  };

  public useGlobalStore = <K, State>(key: K, initialState?: State) => {
    this._setDefaultValue(key, STORE_TYPE.GLOBAL_STORE, initialState);
    const current = this._getStoreValue(
      key,
      STORE_TYPE.GLOBAL_STORE,
      initialState,
    );
    const state = useState(current.value);
    const listeners = {} as any;
    globalStore.forEach((value, key: K) => {
      listeners[key] = new Set();
    });
    useEffect(() => {
      const cleanup = () => {
        console.log(`cleaning ${key} store...`);
        listeners[key].delete(state[1]);
      };
      return cleanup;
    }, []);
    current.updaters.add(state[1]);
    return [current?.value || {}, this._getStateUpdater(key)];
  };

  // useGlobalStore
  public useCurrentStore = <State>(initialState?: State) => {
    const key = this.props.vmName;
    this._setDefaultValue(key, STORE_TYPE.CURRENT_STORE, initialState);
    const current = this._getStoreValue(
      key,
      STORE_TYPE.CURRENT_STORE,
      initialState,
    );
    const state = useState(current.value);
    const listeners = {} as any;
    currentStore.forEach((value, curKey: typeof key) => {
      listeners[curKey] = new Set();
    });
    useEffect(() => {
      const cleanup = () => {
        console.log(`cleaning ${key} store...`);
        listeners[key].delete(state[1]);
      };
      return cleanup;
    }, []);
    current.updaters.add(state[1]);
    return [current?.value || {}, this._getStateUpdater(key)];
  };

  public getGlobalStoreByKey = <K>(key: K) => {
    const current = globalStore.get(key);
    return current?.value || {};
  };
  public getCurrentStore = () => {
    const curKey = this.props.vmName;
    const current = currentStore.get(curKey);
    return current?.value || {};
  };
  // public batchUpdateGlobalStore = <K>(payload: { key: K; value: any }[]) => {
  //   payload.forEach((item) => {
  //     this.updateGlobalStoreByKey(item.key, item.value);
  //   });
  // };

  public getGlobalStoreByKeys = <K>(keys: K[]) => {
    return keys.map((item) => {
      const current = globalStore.get(item);
      return current?.value || {};
    });
  };
}

(global as any).globalStore = {
  globalStore,
  currentStore,
};

export default StoreViewModel;
