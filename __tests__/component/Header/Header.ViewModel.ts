import StoreViewModel from '../../../src/StoreViewModel';
import { GLOBAL_KEYS } from '../types';
import { COMPLEX_DATA } from '../constants';
class HeaderViewModel extends StoreViewModel<any> {
  updateCount = (count) => {
    this.updateGlobalStateByKey(GLOBAL_KEYS.HEADER, {
      count,
    });
  };
  changeData = () => {
    this.updateGlobalStateByKey(GLOBAL_KEYS.HEADER, {
      complexData: COMPLEX_DATA,
    });
  };
  updatePersonInfo = (person: {
    name: string;
    age?: number;
    height?: number;
  }) => {
    this.updateCurrentState({
      person,
    });
  };
  changeHeaderData = (count) => {
    this.updateCurrentState({
      headCount: count,
    });
  };
}
export { HeaderViewModel };
