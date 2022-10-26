import StoreViewModel from '../../../src/StoreViewModel';

class FooterViewModel extends StoreViewModel<any> {
  updateCount = (count) => {
    this.updateCurrentState({
      count,
    });
  };
}
export { FooterViewModel };
