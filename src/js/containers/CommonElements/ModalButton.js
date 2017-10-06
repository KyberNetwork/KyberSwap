import React from "react"
import { connect } from "react-redux"

import { openModal } from "../../actions/utilActions"


@connect((store) => {
  return {}
})
export default class ModalButton extends React.Component {

  openModal = (event) => {
    if (this.props.preOpenHandler) {
      this.props.preOpenHandler(event)
    }
    this.props.dispatch(openModal(this.props.modalID))
  }

  render() {
    return (
      <button class={this.props.className} title={this.props.title} onClick={this.openModal} >
        {this.props.children || "+"}
      </button>
    )
  }
}
