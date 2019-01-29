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

    let termLink = (<a class="exchange-terms__link" href={termAndConditionUrl} target="_blank" onClick={(e) => {this.props.analytics.callTrack("trackClickShowTermAndCondition")}}>
      {this.props.translate("terms.terms_and_condition") || " Terms and Conditions "}
    </a>)
    
    return (
      <div className="exchange-terms" onClick={() => {this.props.analytics.callTrack("acceptTerm", this.props.tradeType)}}>
        <span>
          {this.props.tradeType === "swap" ? this.props.translate("terms.description_term_swap", {term: termLink}) || `By Swapping, you agree to the ${termLink}`
          : this.props.translate("terms.description_term_transfer", {term: termLink}) || `By Transfering, you agree to the ${termLink}`}
        </span>
        {/* <a class="exchange-terms__link" href={termAndConditionUrl} target="_blank" onClick={(e) => {this.props.analytics.callTrack("trackClickShowTermAndCondition")}}>
          {this.props.translate("terms.terms_and_condition") || " Terms and Conditions "}
        </a> */}
      </div>
    )
  }
}
