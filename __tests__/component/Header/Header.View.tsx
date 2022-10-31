import { HeaderViewModel } from './Header.ViewModel';
import { useVM } from '../../../src/useVM';
import { GLOBAL_KEYS } from '../types';

export default function Header() {
  const {
    updateCount,
    changeData,
    changeHeaderData,
    useGlobalState,
    updatePersonInfo,
    useCurrentState,
  } = useVM(HeaderViewModel, { count: 1 });
  const data = useGlobalState(GLOBAL_KEYS.HEADER, { count: 0 });
  const headerData = useCurrentState({
    headCount: 0,
    person: { name: '', age: 0, height: 0 },
  });
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
    updatePersonInfo,
  };
}
