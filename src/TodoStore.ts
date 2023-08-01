import { ITodoList } from "./TodoList";
import { debounce } from "./Utils";

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

export class CloudTodoStore implements ITodoStore {
  static url = "http://localhost:54331";
  static todoApi = CloudTodoStore.url + "/api/todolist";

  private count = 1;

  async fetchTodoList(listId: string): Promise<ITodoList | null> {
    if (!listId) {
      return null;
    }

    const requestOptions = {
      method: "GET",
    };

    const res = await fetch(
      `${CloudTodoStore.todoApi}/${listId}`,
      requestOptions
    );

    if (!res.ok) return null;

    const list: ITodoList = (await res.json()) ?? {};

    return list;
  }

  private debouncedPutTodoList = debounce(
    this,
    500,
    (id: string, requestOptions: RequestInit) => {
      fetch(`${CloudTodoStore.todoApi}/${id}`, requestOptions).then(
        (res: Response) => {
          console.log("update " + this.count++ + " " + res.ok);
        }
      );
    }
  );

  async updateTodoList(list: ITodoList): Promise<boolean> {
    if (!list || !list.id) {
      return false;
    }

    const requestOptions = {
      method: "PUT",
      body: JSON.stringify(list),
    };

    this.debouncedPutTodoList(list.id, requestOptions);

    return true;
  }
}
