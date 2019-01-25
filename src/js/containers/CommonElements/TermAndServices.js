import React from "react"
import { Modal } from "../../components/CommonElement"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux';
import * as analytics from "../../utils/analytics"
import { isUserEurope } from "../../utils/common"

@connect((store, props) => {
  return {
    translate: getTranslate(store.locale),
    onClick: props.onClick
  }
})

export default class TermAndServices extends React.Component {


  render() {    
    var termConditions = (<a href="https://files.kyber.network/tac.pdf" target="_blank" onClick={(e) => { analytics.trackClickShowTermAndCondition() }}>
      {this.props.translate("terms.terms_and_condition") || " Terms and Conditions "}
    </a>)
    // if (isUserEurope()){
    //    termConditions = (<a href="https://files.kyber.network/tac-eu.pdf" target="_blank" onClick={(e) => {analytics.trackClickShowTermAndCondition()}}>
    //   {this.props.translate("terms.terms_and_condition") || " Terms and Conditions "}  
    //     </a> )
    // }else{
    //    termConditions = (<a href="https://files.kyber.network/tac.html" target="_blank" onClick={(e) => {analytics.trackClickShowTermAndCondition()}}>
    // {this.props.translate("terms.terms_and_condition") || " Terms and Conditions "}  
    //   </a> )
    // }

    return (
      <div className="term-services">
        <div className="landing-page__content-btn-container">
          <button className="landing-page__content-btn button" onClick={this.props.onClick}>{this.props.translate("terms.swap") || "Swap"}</button>
        </div>
        <span className="term-text">
          <i>
            By Swapping, you agree to the <br></br> {termConditions}
          </i>
        </span>
      </div>
    )
  }
}
