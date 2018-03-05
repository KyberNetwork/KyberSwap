import React from "react"
import { Link } from 'react-router-dom'
import { Rate, Address } from "../Header"
import AnalyzeLogModal from '../Transaction/AnalyzeLogModal'

const HeaderView = (props) => {
  let logoLink = props.account ? '/exchange' : ''
  return (
    <div>
      <section id="header">
        <div class="row small-11 medium-12 large-12">
          <div class="row column">
            <div class={"column " + (props.account ? 'small-3' : 'small-5 medium-7')}>
              <Link to={logoLink} className={"logo " + (props.isInLandingPage ? 'show-for-medium' : '')}>
                <img src={require("../../../assets/img/logo-beta.svg")} />
              </Link>
              {props.isInLandingPage && 
                <button className="hollow button mb-0" onClick={props.openInfoModal}>Exchange</button>
              }
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