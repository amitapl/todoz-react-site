import { useState } from "react";

export interface ITodoItem {
  text: string;
  done: boolean;
  id: string;
}

interface Props {
  item: ITodoItem;
  onChange: (item: ITodoItem) => void;
  onDragStart: () => void;
  onDragOver: () => void;
  onDragEnd: () => void;
}

const TodoItem = (props: Props) => {
  const [checked, setChecked] = useState(props.item.done);
  const [textInput, setTextInput] = useState(props.item.text);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const handleCheckedChange = () => {
    const value = !checked;
    setChecked(value);
    props.onChange({ ...props.item, done: value });
  };

  const handleTextChange = (e: any) => {
    const value = e.target.value;
    setTextInput(value);
    props.onChange({ ...props.item, text: value });
  };

  const onDragStart = (e: any) => {
    props.onDragStart();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text", e.target.id);
    e.dataTransfer.setDragImage(e.target.parentNode.parentNode, 20, 20);
  };

  const onDragOver = (e: any) => {
    props.onDragOver();
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  return (
    <div
      className="todoItem"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onDragOver={onDragOver}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <span>
          <span className="itemCheckBox">
            <input
              type="checkbox"
              checked={checked}
              onChange={handleCheckedChange}
            />
          </span>
          <span className="info">
            <textarea
              value={textInput}
              onChange={handleTextChange}
              className="todoItemText"
            />
          </span>
          {isHovering && (
            <span
              className="drag"
              draggable
              onDragStart={onDragStart}
              onDragEnd={props.onDragEnd}
            >
              <img src="./elipsis.svg" className="burger" alt="burger icon" />
            </span>
          )}
        </span>
      </form>
    </div>
  );
};

export default TodoItem;
