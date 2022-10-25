import StoreViewModel from '../../../src/StoreViewModel';
import { GLOBAL_KEYS } from '../types';
import { COMPLEX_DATA } from '../constants';
class HeaderViewModel extends StoreViewModel<any> {
  updateCount = count => {
    this.updateGlobalStoreByKey(GLOBAL_KEYS.HEADER, {
      count,
    });
  };
  changeData = () => {
    this.updateGlobalStoreByKey(GLOBAL_KEYS.HEADER, {
      complexData: COMPLEX_DATA,
    });
  };
  changeHeaderData = count => {
    this.updateCurrentStore({
      headCount: count,
    });
  };
}
export { HeaderViewModel };
