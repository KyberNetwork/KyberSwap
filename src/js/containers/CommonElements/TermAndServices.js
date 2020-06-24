import React from "react";
import { connect } from "react-redux";
import { getTranslate } from 'react-localize-redux';

@connect((store) => {
  return {
    translate: getTranslate(store.locale),
    analytics: store.global.analytics
  }
})

export default class TermAndServices extends React.Component {
  render() {
    let termAndConditionUrl = "http://files.kyberswap.com/tac.pdf";

    let termLink = (
      <a className="exchange-terms__link" href={termAndConditionUrl} target="_blank" onClick={() => {this.props.analytics.callTrack("trackClickShowTermAndCondition")}}>
        {this.props.translate("terms.terms_and_condition") || " Terms and Conditions "}
      </a>
    )

    return (
      <div className="exchange-terms theme__text-4" onClick={() => {this.props.analytics.callTrack("acceptTerm", this.props.tradeType)}}>
        <span>
          {this.props.translate("terms.description_term", {term: termLink}) || `By using KyberSwap, you agree to the ${termLink}`}
        </span>
      </div>
    )
  }
}
