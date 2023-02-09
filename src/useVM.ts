import { useState, useEffect } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';
import { randomString } from './utils';
import StoreViewModel from './StoreViewModel';

function useVM<VM extends StoreViewModel<P>, P, T>(
  ViewModel: new (props: P, context?: T) => VM,
  props: P,
  context?: T,
) {
  let [vm] = useState(() => {
    const newProps = {
      ...props,
      VM_NAME: `${ViewModel.name}-${randomString(4)}`,
    };
    return new ViewModel(newProps, context);
  });
  useEffect(() => {
    Object.assign(vm.props, { ...props });
  }, [props]);

  useDeepCompareEffect(() => {
    if (vm?.onPropsChanged) {
      vm.onPropsChanged(props);
    }
  }, [props]);

  useEffect(() => {
    vm.mounted();
    const cleanup = () => {
      vm.unmounted();
      return;
    };
    return cleanup;
  }, [vm]);

  return vm;
}

export { useVM };
