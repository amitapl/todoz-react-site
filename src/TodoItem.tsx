import { useState } from "react";
// @ts-ignore
import { Checkbox, Label, Input, Row, Col, Icon, Div, Text } from "atomize";

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
  onDelete: (item: ITodoItem) => void;
}

const TodoItem = (props: Props) => {
  const [checked, setChecked] = useState(props.item.done);
  const [textInput, setTextInput] = useState(props.item.text);
  const [isHovering, setIsHovering] = useState(false);
  const [inputActive, setInputActive] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const handleInputMouseOver = () => {
    setInputActive(true);
  };

  const handleInputMouseOut = () => {
    setInputActive(false);
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

  const onDelete = () => {
    props.onDelete(props.item);
  };

  return (
    <div
      className="todoItem"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onDragOver={onDragOver}
    >
      <Row
        m="10px"
        p="10px"
        bg={checked ? "success300" : "info200"}
        border="1px solid"
        borderColor="info800"
        hoverBg={checked ? "success400" : "info300"}
      >
        <Col size="1" d="flex" align="center">
          {isHovering && (
            <Div
              d="flex"
              align="center"
              className="drag"
              draggable
              onDragStart={onDragStart}
              onDragEnd={props.onDragEnd}
            >
              <Icon name="OptionsVertical" size="30px" />
            </Div>
          )}
        </Col>
        <Col size="10">
          <Input
            defaultValue={textInput}
            bg={inputActive ? "info100" : "info200"}
            hoverBg="info100"
            borderWidth="1px solid"
            borderColor={inputActive ? "info900" : "info300"}
            style={{ "text-decoration": checked ? "line-through" : "none" }}
            rounded="0"
            onChange={handleTextChange}
            onMouseOver={handleInputMouseOver}
            onMouseOut={handleInputMouseOut}
            onFocus={handleInputMouseOver}
            onFocusOut={handleInputMouseOut}
            transition="false"
            w="100%"
          />
        </Col>
        <Col size="1" d="flex" align="center" textAlign="right">
          <Label>
            <Checkbox
              onChange={handleCheckedChange}
              checked={checked}
              inactiveColor="success700"
              activeColor="success700"
              size="24px"
            />
          </Label>
          {isHovering && (
            <Icon
              name="Delete"
              cursor="pointer"
              size="20px"
              onClick={onDelete}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default TodoItem;
