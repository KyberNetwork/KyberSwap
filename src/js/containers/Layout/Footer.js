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
          <div className="column large-6 medium-6 small-12 footer-menu">
            <ul className="links">
              <li>
                <a>Product Feedback</a>
              </li>
              <li>
                <a>Help</a>
              </li>
            </ul>
          </div>
          <div className="column large-6 medium-6 small-12 text-right">
            Developed with <span className="emoji"> ❤️ </span> and <span className="emoji"> ☕ </span>
            <br></br>
            ©️ 2018 KYBER NETWORK PTE. LTD.
          </div>
        </div>
      </div>
    )  
  }
}