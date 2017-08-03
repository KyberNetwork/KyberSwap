import React from "react"
import { connect } from "react-redux"
import { selectCrossSend, deselectCrossSend, selectDestToken } from "../../actions/exchangeFormActions"
import constants from "../../services/constants"
import supported_tokens from "../../services/supported_tokens"

@connect((store, props) => {
  var exchangeForm = store.exchangeForm[props.exchangeFormID]
  exchangeForm = exchangeForm || {...constants.INIT_EXCHANGE_FORM_STATE}
  return {
    isCrossSend: exchangeForm.isCrossSend,
    sourceToken: exchangeForm.sourceToken,
    destToken: exchangeForm.destToken,
  }
})

export default class CrossSend extends React.Component {

  toggleCrossSend = (event) => {
    if (event.target.checked) {
      if (this.props.sourceToken == this.props.destToken) {
        if (this.props.sourceToken == constants.ETHER_ADDRESS) {
          this.props.dispatch(selectDestToken(
            this.props.exchangeFormID,
            supported_tokens[0].address,
          ))
        } else {
          this.props.dispatch(selectDestToken(
            this.props.exchangeFormID,
            constants.ETHER_ADDRESS,
          ))
        }
      }
      this.props.dispatch(selectCrossSend(this.props.exchangeFormID))
    } else {
      this.props.dispatch(deselectCrossSend(this.props.exchangeFormID))
    }
  }

  render() {
    return (
      <li>
        <div>
          <label>In different token</label>
          <input name="cross-send" type="checkbox" id="cross-send"
            checked={this.props.isCrossSend}
            onChange={this.toggleCrossSend} />
          <label class="k-checkbox" for="cross-send"></label>
        </div>
      </li>
    )
  }
}
