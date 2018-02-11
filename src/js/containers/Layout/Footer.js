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
          <div className="column medium-6 small-12 footer-menu">
            <ul className="links">
              <li>
                <a href="https://home.kyber.network" target="_blank">Home</a>
              </li>
              <li>
                <a href="mailto:support@kyber.network">{this.props.translate('product_feedback') || 'Product Feedback'}</a>
              </li>
              <li>
                <a href="https://kybernetwork.zendesk.com/" target="_blank">{this.props.translate('help') || 'Help'}</a>
              </li>
            </ul>
            ©️ 2018 Kyber Network
          </div>
          <div className="column medium-6 small-12 footer-menu text-right">
            <div className="d-inline-block">
              Developed with <span className="emoji"> ❤️ </span> and <span className="emoji"> ☕ </span>
              <br></br>
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
          </div>
        </div>
      </div>
    )  
  }
}