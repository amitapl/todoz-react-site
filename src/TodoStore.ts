import { ITodoList } from "./TodoList";

export interface ITodoStore {
  fetchTodoList: (listId: string) => Promise<ITodoList | null>;
  updateTodoList: (list: ITodoList) => Promise<boolean>;
}

export class LocalTodoStore implements ITodoStore {
  fetchTodoList(listId: string): Promise<ITodoList | null> {
    if (!listId) {
      return Promise.resolve<ITodoList | null>(null);
    }

    const listStr: string | null = localStorage.getItem(
      this.getListStoredKey(listId)
    );
    if (!listStr) {
      return Promise.resolve<ITodoList | null>(null);
    }

    let list: ITodoList | null = JSON.parse(listStr);
    return Promise.resolve<ITodoList | null>(list);
  }

  updateTodoList(list: ITodoList): Promise<boolean> {
    if (!list || !list.id) {
      return Promise.resolve(false);
    }

    localStorage.setItem(this.getListStoredKey(list.id), JSON.stringify(list));
    return Promise.resolve(true);
  }

  private getListStoredKey(listId: string): string {
    return "todoList-" + listId;
  }
}
