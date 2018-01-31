import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'

@connect((store) => {
  return {
    translate: getTranslate(store.locale)
  }
})

export default class Footer extends React.Component {
  
  render(){
    return (
      <div className="row small-11 medium-12 large-12">
        <div className="column row">
          <div className="column medium-6 small-12 footer-menu text-xs-only-center">
            <ul className="links">
              <li>
                <a>{this.props.translate('product_feedback') || 'Product Feedback'}</a>
              </li>
              <li>
                <a>{this.props.translate('help') || 'Help'}</a>
              </li>
            </ul>
            <ul className="links">
              <li>
                <a href="https://t.me/kybernetwork" target="_blank">Telegram</a>
              </li>
              <li>
                <a href="https://github.com/kyberNetwork/" target="_blank">GitHub</a>
              </li>
              <li>
                <a href="https://twitter.com/KyberNetwork" target="_blank">Twitter</a>
              </li>
            </ul>
          </div>
          <div className="column medium-6 small-12 text-right text-xs-only-center">
            Developed with <span className="emoji"> ❤️ </span> and <span className="emoji"> ☕ </span>
            <br></br>
            ©️ 2018 KYBER NETWORK
          </div>
        </div>
      </div>
    )  
  }
}