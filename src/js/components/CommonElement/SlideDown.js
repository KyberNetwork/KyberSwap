import React from "react";

export const SlideDownTrigger = (props) => (
  <div className={`slide-down__trigger ${props.className ? props.className : ''}`} onClick={props.toggleContent}>
    {props.children}
  </div>
);

export const SlideDownContent = (props) => (
  <div className={`slide-down__content ${props.className ? props.className : ''}`}>
    <div className="slide-down__fade-in">
      {props.children}
    </div>
  </div>
);

const SlideDown = (props) => {
  return (
    <div className={`slide-down ${props.active ? 'slide-down--active' : ''} ${props.className ? props.className : ''}`}>
      {props.children}
    </div>
  )
};

export default SlideDown;
