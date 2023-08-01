import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ITodoItem } from "./TodoItem";
import TodoItems from "./TodoItems";
import { ITodoStore, CloudTodoStore } from "./TodoStore";
import { IIdStore, LocalIdStore } from "./IdStore";
// @ts-ignore
import { Input, Icon, Div, Row, Col, Container, Text } from "atomize";

export interface ITodoList {
  todoItems: ITodoItem[];
  name: string;
  creationDate: Date;
  notes: string;
  id: string;
}

function makeKey(): string {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 8) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const TodoList = () => {
  let { id } = useParams();

  const storeRef: React.MutableRefObject<ITodoStore> = useRef(
    new CloudTodoStore()
  );

  const idStoreRef: React.MutableRefObject<IIdStore> = useRef(
    new LocalIdStore()
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      id = idStoreRef.current.getCurrentId();
      if (!id) {
        id = makeKey();
      }
      navigate("/list/" + id, { replace: true });
    }

    idStoreRef.current.setCurrentId(id);

    const updateTodoList = async () => {
      const list = await storeRef.current.fetchTodoList(id ?? "");
      if (list) {
        setTodoList(list);
      }
    };

    updateTodoList();
  }, []);

  const [todoList, setTodoList_] = useState<ITodoList>({
    name: "",
    creationDate: new Date(),
    notes: "",
    id: id || "",
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

  const handlePasteItems = (e: any) => {
    const content: string = e?.clipboardData.getData("text");
    if (!content) return;

    const list = content
      .split("\n")
      .map((item: string) => item?.trim())
      .filter((item: string) => item);

    if (list.length <= 1) return;

    addTodoItems(list);

    e.preventDefault();
  };

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

  const addTodoItems = (items: string[]) => {
    if (!items || items.length === 0) return;

    const todoItems: ITodoItem[] = items.map((item: string) => {
      return {
        text: item,
        done: false,
        id: makeKey(),
      };
    });

    onTodoListUpdate((listToUpdate: ITodoList) => {
      listToUpdate.todoItems = [...todoItems, ...todoList.todoItems];
    });

    setAddTodoItemText("");
  };

  const onTodoListUpdate = (
    todoListUpdater: (listToUpdate: ITodoList) => void
  ) => {
    const updatedTodoList: ITodoList = {
      ...todoList,
    };

    todoListUpdater(updatedTodoList);
    storeRef.current.updateTodoList(updatedTodoList);
    setTodoList(updatedTodoList);
  };

  const onTodoListNameUpdate = (listName: string) => {
    if (!listName) return;

    onTodoListUpdate((listToUpdate: ITodoList) => {
      listToUpdate.name = listName;
    });
  };

  function onKeyDown(e: any): void {
    if (e.key === "Enter") {
      addTodoItem();
    }
  }

  return (
    <Container>
      <div className="todoList">
        <div className="fixedPart">
          <Row m="10px" p="10px">
            <Col>
              <Input
                name="listName"
                placeholder="Type list name..."
                defaultValue={todoList?.name}
                onChange={(e: any) => onTodoListNameUpdate(e.target.value)}
                style={{ border: "solid", borderWidth: "0 0 2px 0" }}
                bg="gray200"
                hoverBg="gray400"
                rounded="0"
                borderColor="info900"
                w="100%"
                textSize="title"
              />
            </Col>
          </Row>

          <Row m="10px" p="10px">
            <Col size="1"></Col>
            <Col size="10">
              <Div>
                <Input
                  name="newTodo"
                  placeholder="Type a new item or paste a list of items..."
                  defaultValue={addTodoItemText}
                  onChange={(e: any) => setAddTodoItemText(e.target.value)}
                  onPaste={(e: any) => handlePasteItems(e)}
                  onKeyDown={onKeyDown}
                  w="100%"
                />
              </Div>
            </Col>
            <Col size="1" d="flex" align="center">
              <Icon
                name="Add"
                size="30px"
                cursor="pointer"
                onClick={() => addTodoItem()}
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
