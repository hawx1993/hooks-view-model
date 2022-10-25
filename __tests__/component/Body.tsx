import { useVM } from '../../src/useVM';
import StoreViewModel from './../../src/';
import { GLOBAL_KEYS } from './types';

export default function Body() {
  const { useGlobalStore } = useVM(StoreViewModel, {});
  const [bodyData] = useGlobalStore(GLOBAL_KEYS.HEADER, {});
  const { count, complexData } = bodyData;
  console.log('body-Data', bodyData);
  return {
    bodyCount: count,
    bodyData: bodyData,
    complexData,
  };
}
