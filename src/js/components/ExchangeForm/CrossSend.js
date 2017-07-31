import React from "react"
import { connect } from "react-redux"
import { selectCrossSend, deselectCrossSend } from "../../actions/exchangeFormActions"
import constants from "../../services/constants"

@connect((store, props) => {
  var exchangeForm = store.exchangeForm[props.exchangeFormID]
  exchangeForm = exchangeForm || {...constants.INIT_EXCHANGE_FORM_STATE}
  return {
    isCrossSend: exchangeForm.isCrossSend,
  }
})

export default class TokenDest extends React.Component {

  toggleCrossSend = (event) => {
    if (event.target.checked) {
      this.props.dispatch(selectCrossSend(this.props.exchangeFormID))
    } else {
      this.props.dispatch(deselectCrossSend(this.props.exchangeFormID))
    }
  }

  render() {
    return (
      <li>
        <div>
          <label>Cross send?</label>
          <input name="cross-send" type="checkbox" id="cross-send"
            checked={this.props.isCrossSend}
            onChange={this.toggleCrossSend} />
          <label class="k-checkbox" for="cross-send"></label>
        </div>        
      </li>
    )
  }
}
