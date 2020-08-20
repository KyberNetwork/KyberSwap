import React, { Fragment } from "react"
import { connect } from "react-redux"
import { openPromoCodeModal } from "../../actions/accountActions"
import { getTranslate } from 'react-localize-redux'

@connect((store) => {
  return {
    translate: getTranslate(store.locale),
    analytics: store.global.analytics
  }
})
export default class ImportByPromoCode extends React.Component {
  openModal() {
    this.props.dispatch(openPromoCodeModal());
    this.props.analytics.callTrack("trackClickImportAccount", "promo code", this.props.tradeType);
  }

  render() {
    return (
      <Fragment>
        {!this.props.isOnMobile && (
          <div className="import-account__block theme__import-button" onClick={this.openModal.bind(this)}>
            <div className="import-account__icon promo-code"/>
            <div className="import-account__name">{this.props.translate("landing_page.promo_code") || "PROMO CODE"}</div>
          </div>
        )}

        {this.props.isOnMobile && (
          <div className={"import-account__block theme__import-button"}>
            <div className={"import-account__block-left"}>
              <div className="import-account__icon promo-code"/>
              <div>
                <div className="import-account__name">{this.props.translate("landing_page.promo_code") || "PROMO CODE"}</div>
                <div className="import-account__desc">{this.props.translate("address.import_address") || "Access your Wallet"}</div>
              </div>
            </div>
            <div className="import-account__block-right" onClick={this.openModal.bind(this)}>{this.props.translate("address.enter") || "Enter"}</div>
          </div>
        )}
      </Fragment>
    )
  }
}
