import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'

@connect((store, props) => {
  return {
    isOnMobile: store.global.isOnMobile,
    translate: getTranslate(store.locale)
  }
})
export default class AdvanceAccount extends React.Component {
  render() {
    return (
      <div className="exchange-account">
        <div className="exchange-account__wrapper">
          <div className="exchange-account__container">
            <div className={`exchange-account__content ${this.props.isOpenAdvance ? "exchange-account__content--animation" : ""}`}>
              <div className={`exchange-account__adv-config exchange-account__content--open`}>{this.props.advanceLayout}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
