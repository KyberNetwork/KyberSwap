import React from "react"
import { Link } from 'react-router-dom'
import { Rate, Address } from "../Header"

const HeaderView = (props) => {
  return (
    <div>
      <section id="header">
        <div class="row">
          <div class={"column " + (props.account ? "small-4 medium-6 large-7 hide-for-small-only" : "small-5 medium-6 large-7")}>
            <Link to="/info" className="logo">
              <img src="/assets/img/logo.svg" />
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