import StoreViewModel from '../../../src/StoreViewModel';

class FooterViewModel extends StoreViewModel<any> {
  updateCount = count => {
    this.updateCurrentStore({
      count,
    });
  };
}
export { FooterViewModel };
