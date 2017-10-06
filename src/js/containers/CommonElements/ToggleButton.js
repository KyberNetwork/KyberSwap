import React from "react"
import { connect } from "react-redux"

import { hideControl, showControl } from "../../actions/utilActions"


@connect((store) => {
  return {
    utils:store.utils
  }
})
export default class ToggleButton extends React.Component {

  toggleControl = (event) => {
    if(this.props.utils.showControl) {
      this.props.dispatch(hideControl())
    }else{
      this.props.dispatch(showControl())
    }
  }

  render() {
    return (
      <button class="import" onClick={this.toggleControl} >
        <i class="k-icon k-icon-btn-green"></i>
      </button>
    )
  }
}
