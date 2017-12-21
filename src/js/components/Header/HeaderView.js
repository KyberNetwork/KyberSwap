import React from "react"
import { Link } from 'react-router-dom'
import { Rate, Address } from "../Header"
//import logo from "../../../assets/img/logo.svg"

const HeaderView = (props) => {
  let logoLink = props.account ? '/exchange' : ''
  return (
    <div>
      <section id="header">
        <div class="row">
          <div class={"column " + (props.account ? "small-4 medium-5 large-7 hide-for-small-only" : "small-5 medium-6 large-7")}>
            <Link to={logoLink} className="logo">
              <img src={require("../../../assets/img/logo.svg")} />
            </Link>
          </div>
          {props.address}
        </div>
      </section>

      <section id="rate-bar" style={{ minHeight: 81 }}>
        {props.rate}
      </section>

    </div>
  )
}

export default HeaderView