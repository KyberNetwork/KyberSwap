import React from "react";

export default class NameAndDesc extends React.Component {
  render() {
    return (
      <div>
        <p>Name: {this.props.name}</p>
        <p>Desc: {this.props.description}</p>
      </div>
    )
  }
}
