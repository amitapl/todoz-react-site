import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ITodoItem } from "./TodoItem";
import TodoItems from "./TodoItems";
import { ITodoStore, LocalTodoStore } from "./TodoStore";

export interface ITodoList {
  todoItems: ITodoItem[];
  name: string;
  creationDate: Date;
  notes: string;
  id: string;
}

interface Props {
  id: string;
}

function makeKey(): string {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 6) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const TodoList = (props: Props) => {
  const store: ITodoStore = new LocalTodoStore();
  const [todoList, setTodoList] = useState<ITodoList>({
    name: "",
    creationDate: new Date(),
    notes: "",
    id: props.id,
    todoItems: [],
  });

  useEffect(() => {
    const updateTodoList = async () => {
      const list = await store.fetchTodoList(props.id);
      if (list) {
        setTodoList(list);
      }
    };

    updateTodoList();
  }, []);

  let onTodoListUpdate = (
    todoListUpdater: (listToUpdate: ITodoList) => void
  ) => {
    const updatedTodoList: ITodoList = {
      ...todoList,
    };

    todoListUpdater(updatedTodoList);
    store.updateTodoList(updatedTodoList);
    setTodoList(updatedTodoList);
  };

  return (
    <div className="todoList">
      <div className="fixedPart">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const listName = formData.get("listName")?.toString().trim();
            if (!listName) return;

            onTodoListUpdate((listToUpdate: ITodoList) => {
              listToUpdate.name = listName;
            });
          }}
        >
          <div>
            <label htmlFor="name">List </label>
            <input
              name="listName"
              type="text"
              defaultValue={todoList?.name}
              className="todoListName"
              placeholder="Enter list name..."
            />
          </div>
        </form>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const text = formData.get("newTodo")?.toString().trim();
            if (!text) return;

            onTodoListUpdate((listToUpdate: ITodoList) => {
              listToUpdate.todoItems = [
                {
                  text: text,
                  done: false,
                  id: makeKey(),
                },
                ...todoList.todoItems,
              ];
            });
          }}
        >
          <div>
            <textarea
              name="newTodo"
              className="todoItem"
              placeholder="Enter new item..."
            />
            <button type="submit">+</button>
          </div>
        </form>
      </div>

      <TodoItems
        todoItems={todoList?.todoItems}
        onChange={(items: ITodoItem[]) =>
          onTodoListUpdate((listToUpdate: ITodoList) => {
            listToUpdate.todoItems = items;
          })
        }
      />
    </div>
  );
};

export default TodoList;
