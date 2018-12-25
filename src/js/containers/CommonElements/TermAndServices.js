import React from "react";
import { connect } from "react-redux";
import { getTranslate } from 'react-localize-redux';
import { isUserEurope } from "../../utils/common";

@connect((store, props) => {
  return {
    translate: getTranslate(store.locale),
    analytics: store.global.analytics
  }
})

export default class TermAndServices extends React.Component {
  render() {
    let termAndConditionUrl = "https://files.kyber.network/tac.pdf";

    if (isUserEurope()) {
      termAndConditionUrl = "https://files.kyber.network/tac-eu.pdf";
    }
    
    return (
      <div className="exchange-terms" onClick={() => {this.props.analytics.callTrack("acceptTerm", this.props.tradeType)}}>
        <span>By Swapping, you agree to the</span>
        <a class="exchange-terms__link" href={termAndConditionUrl} target="_blank" onClick={(e) => {this.props.analytics.callTrack("trackClickShowTermAndCondition")}}>
          {this.props.translate("terms.terms_and_condition") || " Terms and Conditions "}
        </a>
      </div>
    )
  }
}
