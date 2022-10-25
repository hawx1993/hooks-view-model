import { HeaderViewModel } from './Header.ViewModel';
import { useVM } from '../../../src/useVM';
import { GLOBAL_KEYS } from '../types';

export default function Header() {
  const {
    updateCount,
    changeData,
    changeHeaderData,
    useGlobalStore,
    useCurrentStore,
  } = useVM(HeaderViewModel, {});
  const [data] = useGlobalStore(GLOBAL_KEYS.HEADER, { count: 0 });
  const [headerData] = useCurrentStore({ headCount: 0 });
  const { count, complexData } = data;
  const { headCount } = headerData;
  console.log('Header-data', data, headerData);
  const updateHeaderCount = () => updateCount(count + 1);
  const changeOnlyHeaderData = () => changeHeaderData(headCount + 2);

  return {
    currentHeaderData: headerData,
    globalHeaderData: data,
    changeOnlyHeaderData,
    updateHeaderCount,
    changeData,
    complexData,
  };
}
