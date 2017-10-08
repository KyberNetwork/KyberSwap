import React from "react"
import { connect } from "react-redux"

//import TokenDest from "./TokenDest"
import {TokenDest, MinRate} from "../ExchangeForm"


@connect((store) => {
  return {}
})
export default class Advanced extends React.Component {

  render() {
    return (
      <div class="has-sub-inputs">
        <label>
          If the rate changes:
        </label>
        <div class="sub-inputs">
          <TokenDest
            disableTokenSelect={true}
            onKeyPress={(event) => this.props.focusNext('min_rate', event)}
            exchangeFormID={this.props.exchangeFormID}
            allowDirectSend={this.props.allowDirectSend}/>
          <MinRate onKeyPress={(event) => this.props.goNextStep(event)} exchangeFormID={this.props.exchangeFormID} allowDirectSend={this.props.allowDirectSend}/>
        </div>
      </div>
    )
  }
}
