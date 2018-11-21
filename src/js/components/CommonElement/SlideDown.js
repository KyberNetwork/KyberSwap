import React from "react";

export const SlideDownTrigger = (props) => (
  <div className={"slide-down__trigger" + (props.classNameTrigger ? " " + props.classNameTrigger : "")} onClick={props.onToggleContent}>
    {props.children}
  </div>
);

export const SlideDownContent = (props) => (
  <div className={"slide-down__content" + (props.classNameContent ? " " + props.classNameContent : "")}>
    <div className="slide-down__fade-in">
      {props.children}
    </div>
  </div>
);

const SlideDown = (props) => {
  return (
    <div className={"slide-down" + (props.active ? ' slide-down--active' : '') + (props.classNameWrapper ? " " + props.classNameWrapper : "")}>
      {props.children}
    </div>
  )
};

export default SlideDown;
