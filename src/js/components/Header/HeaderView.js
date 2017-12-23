import React from "react"
import { Link } from 'react-router-dom'
import { Rate, Address } from "../Header"

const HeaderView = (props) => {
  let logoLink = props.account ? '/exchange' : ''
  return (
    <section id="header">
      <div class="row">
        <div class="column">
          <div class={"float-left " + (props.account ? "hide-for-small-only" : "")}>
            <Link to={logoLink} className="logo">
              <img src={require("../../../assets/img/logo.svg")} />
            </Link>
          </div>
          {props.address}
        </div>
      </div>
    </section>
  )
}

export default HeaderView