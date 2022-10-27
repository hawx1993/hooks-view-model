import { useState, useEffect } from 'react';
import StoreViewModel from './StoreViewModel';

function useVM<VM extends StoreViewModel<P>, P, T>(
  ViewModel: new (props: P, context?: T) => VM,
  props: P,
  context?: T,
) {
  const newProps = { ...props, VM_NAME: ViewModel.name };
  let [vm] = useState(() => new ViewModel(newProps, context));

  useEffect(() => {
    vm.mounted();
    const cleanup = () => {
      vm.unmounted();
      return (vm = null);
    };
    return cleanup;
  }, [vm]);

  return vm;
}

export { useVM };
