import React from "react"
import { connect } from "react-redux"
import * as globalActions from "../../actions/globalActions"


@connect((store, props) => {
  return {
    isOnDAPP: store.account.isOnDAPP,
    getAccountTypeHtml: props.getAccountTypeHtml,
    isBalanceActive: props.isBalanceActive,
    balanceLayout: props.balanceLayout,
    isAdvanceActive: props.isAdvanceActive,
    advanceLayout: props.advanceLayout,
    postWithKey: props.postWithKey,
    tradeType: props.tradeType,
    gasPrice: store.exchange.gasPrice
  }
})

export default class AccountAdvance extends React.Component {
  
  clearSession = (e) => {
    if (this.props.tradeType === "swap") {
      this.props.dispatch(globalActions.clearSession(this.props.gasPrice))
      return
    }
    this.props.dispatch(globalActions.clearSession())
  }

  render() {
    return (
      <div className="exchange-account">
        <div className="exchange-account__wrapper">
          {!this.props.isOnDAPP && <div className={"exchange-account__wrapper--reimport"}>
            <div className={"reimport-msg"} onClick={(e) => this.clearSession(e)}>Connect other wallet</div>
          </div>}
          <div className="exchange-account__container container">
            <div className={`exchange-account__content`}>
              {this.props.tradeType === "swap" ? this.props.getAccountTypeHtml(true) : ''}
              <div className={`exchange-account__balance ${this.props.isBalanceActive ? 'exchange-account__content--open' : ''}`}>{this.props.balanceLayout}</div>
              <div className={`exchange-account__adv-config ${this.props.isAdvanceActive ? 'exchange-account__content--open' : ''}`}>{this.props.advanceLayout}</div>
            </div>

            {this.props.postWithKey}
          </div>
        </div>
      </div>
    )
  }
}
