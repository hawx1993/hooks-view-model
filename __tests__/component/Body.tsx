import { useVM } from '../../src/useVM';
import StoreViewModel from './../../src/';
import { GLOBAL_KEYS } from './types';

export default function Body() {
  /* ts-ignore */
  const { useGlobalState } = useVM(StoreViewModel as any, {});
  const bodyData = useGlobalState(GLOBAL_KEYS.HEADER, {});
  const { count, complexData } = bodyData;
  console.log('body-Data', bodyData);
  return {
    bodyCount: count,
    bodyData: bodyData,
    complexData,
  };
}
