import React from "react"
import { connect } from "react-redux"
import { selectCrossSend, suggestRate, deselectCrossSend, selectDestToken } from "../../actions/exchangeFormActions"
import constants from "../../services/constants"
import supported_tokens from "../../services/supported_tokens"
import { currencies } from "../../utils/store"
import { toT, calculateDest } from "../../utils/converter"

@connect((store, props) => {
  var exchangeForm = store.exchangeForm[props.exchangeFormID]
  exchangeForm = exchangeForm || {...constants.INIT_EXCHANGE_FORM_STATE}
  var sourceToken = exchangeForm.sourceToken
  var destToken = exchangeForm.destToken
  var rate = store.global.rates[sourceToken + "-" + destToken]
  return {
    isCrossSend: sourceToken != destToken,
    sourceToken: sourceToken,
    destToken: destToken,
    sourceAmount: exchangeForm.sourceAmount,
    rate: rate,
  }
})

export default class CrossSend extends React.Component {
  selectToken(event) {
    this.props.dispatch(
      selectDestToken(this.props.exchangeFormID, event.target.value))
    if (this.props.sourceToken != "" && event.target.value) {
      this.props.dispatch(suggestRate(
        this.props.exchangeFormID, constants.RATE_EPSILON))
    }
  }

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

  expectedAmount = () => {
    if (this.props.rate) {
      return toT(calculateDest(this.props.sourceAmount, this.props.rate.rate), 12)
    } else {
      return "This pair of token is not supported"
    }
  }

  render() {
    var tokenOptions = currencies().map((tok) => {
      return <option key={tok.address} value={tok.address}>{tok.symbol}</option>
    })
    return (
      <li>
        <div>
          <label>Recipient to receipt</label>
          <select class="selectric" value={this.props.destToken} onChange={this.selectToken.bind(this)}>
            {tokenOptions}
          </select>
          { this.props.isCrossSend ?
            <span class="expected-amount">{ this.expectedAmount() }</span> : ""
          }
        </div>
      </li>
    )
  }
}
