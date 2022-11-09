import StoreViewModel from '../../../src/StoreViewModel';

class FooterViewModel extends StoreViewModel<any> {
  updateCount = (count) => {
    this.updateCurrentState({
      count,
    });
  };

  updateTodoValue = () => {
    this.updateImmerState('todo', (draft) => {
      draft.done = !draft.done;
    });
  };
  updateGlobalTodoValue = () => {
    this.updateGlobalImmerState('GLOBAL_TODO', 'global_todo', (draft) => {
      draft.done = !draft.done;
    });
  };
}
export { FooterViewModel };
