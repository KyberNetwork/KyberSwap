import React from "react"
import { Link } from 'react-router-dom'
import { Rate, Address } from "../Header"
import AnalyzeLogModal from '../Transaction/AnalyzeLogModal'

const HeaderView = (props) => {
  let logoLink = props.account ? '/exchange' : ''
  return (
    <div>
      <section id="header">
        <div className="notice">
          <p><span><a href="#" target="blank">Click here</a></span> to know more about Kyber Network 2.0</p>
        </div>
        <div class="row small-11 medium-12 large-12">
          <div class="row column">
            <div class="column small-3">
              <Link to={logoLink} className="logo">
                <img src={require("../../../assets/img/logo-header.svg")} />
                {/* <span class="beta">Beta</span> */}
              </Link>
            </div>
            {props.infoMenu}
            {props.address}
          </div>
        </div>
      </section>

      <AnalyzeLogModal 
        analyze={props.analyze} 
        onRequestClose={props.onRequestClose}
        isOpen={props.isOpen}
        translate={props.translate}
      />

      {props.balance &&
        <section id="balance-account">
          {props.balance}
        </section>}
    </div>
  )
}

export default HeaderView