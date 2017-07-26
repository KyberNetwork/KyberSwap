import React from "react"
import { connect } from "react-redux"

import { openModal } from "../../actions/utilActions"


@connect((store) => {
  return {}
})
export default class ModalButton extends React.Component {

  openModal = (event) => {
    this.props.dispatch(openModal(this.props.modalID))
  }

  render() {
    return (
      <button class="import" title={this.props.title} onClick={this.openModal} >
        {this.props.children || "+"}
      </button>
    )
  }
}
