import React from "react";
import { connect } from "react-redux";
import { getTranslate } from 'react-localize-redux';
import * as analytics from "../../utils/analytics";
import { isUserEurope } from "../../utils/common";

@connect((store, props) => {
  return {
    translate: getTranslate(store.locale)
  }
})

export default class TermAndServices extends React.Component {
  render() {
    let termAndConditionUrl = "https://files.kyber.network/tac.pdf";

    if (isUserEurope()) {
      termAndConditionUrl = "https://files.kyber.network/tac-eu.pdf";
    }
    
    return (
      <div className="exchange-terms">
        <span>By Swapping, you agree to the</span>
        <a class="exchange-terms__link" href={termAndConditionUrl} target="_blank" onClick={(e) => {analytics.trackClickShowTermAndCondition()}}>
          {this.props.translate("terms.terms_and_condition") || " Terms and Conditions "}
        </a>
      </div>
    )
  }
}
