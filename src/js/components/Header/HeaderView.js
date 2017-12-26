import React from "react"
import { Link } from 'react-router-dom'
import { Rate, Address } from "../Header"

const HeaderView = (props) => {
  let logoLink = props.account ? '/exchange' : ''
  return (
    <div>
      <section id="header">
        <div class="row px-4">
          <div class="column">
            <div class="float-left">
              <Link to={logoLink} className="logo">
                <img src={require("../../../assets/img/logo.svg")} />
              </Link>
            </div>
            {props.address}
          </div>
        </div>
      </section>

      {props.balance &&
        <section id="balance-account">
          {props.balance}
        </section>}
    </div>
  )
}

export default HeaderView