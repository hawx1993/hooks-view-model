import { useVM } from '../../../src/useVM';
import { FooterViewModel } from './Footer.ViewModel';

export default function Footer() {
  const { useCurrentState, updateCount } = useVM(FooterViewModel, {});
  const { count } = useCurrentState({
    count: 0,
  });
  const incrementFooterCount = () => updateCount(count + 1);
  return {
    count,
    incrementFooterCount,
  };
}
// 1、不同的key，数据不会互相影响，store a update， store b不会更新
// 2、×数据更新之后，教上次无变化， 则组件不更新
// 3、可做到细粒度更新，可更新对象单个字段，其他不更新的字段不受影响
// 3、实现localStore
