import { useState } from "react";
import TodoItem from "./TodoItem";
import { ITodoItem } from "./TodoItem";

interface Props {
  todoItems: ITodoItem[];
  onChange: (items: ITodoItem[]) => void;
}

const TodoItems = (props: Props) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedItem, setDraggedItem] = useState<ITodoItem | null>(null);

  const onTodoItemChange = (item: ITodoItem) => {
    if (!props.todoItems) return;
    const updatedTodoItems: ITodoItem[] = props.todoItems.map(
      (todoItem: ITodoItem) => {
        return todoItem.id !== item.id ? todoItem : item;
      }
    );
    props.onChange(updatedTodoItems);
  };

  const onDragStart = (index: number) => {
    setDraggedIndex(index);
    setDraggedItem(props.todoItems[index]);
  };

  const onDragOver = (index: number) => {
    if (draggedIndex === null) {
      return;
    }

    const draggedOverItem = props.todoItems[index];

    // if the item is dragged over itself, ignore
    if (draggedItem === draggedOverItem || !draggedItem) {
      return;
    }

    // filter out the currently dragged item
    let updatedTodoItems = props.todoItems.filter(
      (item) => item !== draggedItem
    );

    // add the dragged item after the dragged over item
    updatedTodoItems.splice(index, 0, draggedItem);

    props.onChange(updatedTodoItems);
  };

  const onDragEnd = () => {
    setDraggedIndex(null);
    setDraggedItem(null);
  };

  const onDelete = (itemToDelete: ITodoItem) => {
    if (!props.todoItems) return;

    let updatedTodoItems = props.todoItems.filter(
      (item) => item !== itemToDelete
    );

    props.onChange(updatedTodoItems);
  };

  return (
    <div className="todoItems">
      {props.todoItems?.map(
        (todoItem: ITodoItem, index: number, _: ITodoItem[]) => {
          return (
            <TodoItem
              item={todoItem}
              key={todoItem.id}
              onChange={onTodoItemChange}
              onDragStart={() => onDragStart(index)}
              onDragOver={() => onDragOver(index)}
              onDragEnd={onDragEnd}
              onDelete={onDelete}
            />
          );
        }
      )}
    </div>
  );
};

export default TodoItems;
