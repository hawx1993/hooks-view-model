import { GLOBAL_KEYS, StoreViewModel } from '../GlobalStore';

class FooterViewModel extends StoreViewModel<any> {
  updateCount = count => {
    this.updateCurrentStore({
      count,
    });
  };
}
export { FooterViewModel };
