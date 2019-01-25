import React from "react";
import { connect } from "react-redux";
import { getTranslate } from 'react-localize-redux';
import * as analytics from "../../utils/analytics"

@connect((store, props) => {
  return {
    translate: getTranslate(store.locale),
    analytics: store.global.analytics
  }
})

export default class TermAndServices extends React.Component {
  render() {
    let termAndConditionUrl = "https://files.kyber.network/tac.pdf";
    
    return (
      <div className="exchange-terms" onClick={() => {this.props.analytics.callTrack("acceptTerm", this.props.tradeType)}}>
        <span>By {this.props.tradeType === "swap" ?  "Swapping" : "Transfering"}, you agree to the</span>
        <a class="exchange-terms__link" href={termAndConditionUrl} target="_blank" onClick={(e) => {this.props.analytics.callTrack("trackClickShowTermAndCondition")}}>
          {this.props.translate("terms.terms_and_condition") || " Terms and Conditions "}
        </a>
      </div>
    )
  }
}
