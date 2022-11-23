import StoreViewModel from '../../../src/StoreViewModel';

class FooterViewModel extends StoreViewModel<any> {
  updateCount = (count) => {
    this.updateCurrentState({
      count,
    });
  };

  updateTodoValue = () => {
    this.updateImmerState((draft) => {
      draft.todo.done = !draft.todo.done;
    });
  };
  updateGlobalTodoValue = () => {
    this.updateGlobalImmerState('GLOBAL_TODO', (draft) => {
      draft.global_todo.done = !draft.global_todo.done;
    });
  };
}
export { FooterViewModel };
