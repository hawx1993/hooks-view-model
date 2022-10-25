import { GLOBAL_KEYS, StoreViewModel } from '../GlobalStore';
const random = require('random-value-generator');

class HeaderViewModel extends StoreViewModel<any> {
  updateCount = count => {
    this.updateGlobalStoreByKey(GLOBAL_KEYS.HEADER, {
      count,
    });
  };
  changeData = () => {
    this.updateGlobalStoreByKey(GLOBAL_KEYS.HEADER, {
      randomData: {
        address: random.randomHash(66),
        number: random.randomNumber(99999),
        array: [
          random.randomNumber(2),
          random.randomNumber(3),
          random.randomNumber(4),
        ],
      },
    });
  };
  changeHeaderData = count => {
    console.log('changeHeaderData', count);
    this.updateCurrentStore({
      headCount: count,
    });
  };
}
export { HeaderViewModel };
