import { useState, useEffect, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { ITodoItem } from "./TodoItem";
import TodoItems from "./TodoItems";
import { ITodoStore, LocalTodoStore } from "./TodoStore";
// @ts-ignore
import { Input, Icon, Div, Row, Col, Container } from "atomize";

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
  const [todoList, setTodoList_] = useState<ITodoList>({
    name: "",
    creationDate: new Date(),
    notes: "",
    id: props.id,
    todoItems: [],
  });

  const setTodoList = (list: ITodoList) => {
    if (list && list.todoItems) {
      list.todoItems = list.todoItems.sort((a: ITodoItem, b: ITodoItem) =>
        a?.done === b?.done ? 0 : a?.done ? 1 : -1
      );
    }
    setTodoList_(list);
  };

  const [addTodoItemText, setAddTodoItemText] = useState<string>("");

  const addTodoItem = () => {
    if (!addTodoItemText) return;

    onTodoListUpdate((listToUpdate: ITodoList) => {
      listToUpdate.todoItems = [
        {
          text: addTodoItemText,
          done: false,
          id: makeKey(),
        },
        ...todoList.todoItems,
      ];
    });

    setAddTodoItemText("");
  };

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
    <Container>
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
              <Input
                name="listName"
                placeholder="Type list name..."
                defaultValue={todoList?.name}
                w="200px"
              />
            </div>
          </form>

          <Row p="10px">
            <Col size="1">
              <Div></Div>
            </Col>
            <Col size="10">
              <Div>
                <Input
                  name="newTodo"
                  placeholder="Type a new todo item..."
                  defaultValue={addTodoItemText}
                  onChange={(e: any) => setAddTodoItemText(e.target.value)}
                />
              </Div>
            </Col>
            <Col size="1" d="flex" align="center">
              <Icon
                name="Add"
                size="30px"
                cursor="pointer"
                onClick={addTodoItem}
              />
            </Col>
          </Row>
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
    </Container>
  );
};

export default TodoList;
