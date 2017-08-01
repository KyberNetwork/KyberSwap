import React from "react"
import { connect } from "react-redux"

import { openModal } from "../../actions/utilActions"


@connect((store) => {
  return {}
})
export default class ModalLink extends React.Component {

  openModal = (event) => {
    this.props.dispatch(openModal(this.props.modalID))
  }

  render() {
    return (
      <div onClick={this.openModal} >
    {this.props.content}
      </div>
    )
  }
}
