function useVM<VM, P, T>(
  ViewModel: new (props: P, context?: T) => VM,
  props: P,
  context?: T
) {
  const newProps = Object.assign(props, {
    name: ViewModel.name,
  });
  const vm = new ViewModel(newProps, context);
  return vm;
}

export { useVM };
