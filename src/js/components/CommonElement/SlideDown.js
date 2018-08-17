import React from "react";

export const SlideDownTrigger = (props) => (
  <div className={"slide-down__trigger"} onClick={props.onToggleContent}>
    {props.children}
  </div>
);

export const SlideDownContent = (props) => (
  <div className={"slide-down__content"}>
    {props.children}
  </div>
);

const SlideDown = (props) => {
  return (
    <div className={"slide-down" + (props.active ? ' slide-down--active' : '')}>
      {props.children}
    </div>
  )
};

export default SlideDown;
