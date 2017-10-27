import { Link } from 'react-router-dom'
import React from "react"


const Address = (props) => {
  var link = props.path === "/transfer" ? (
    <Link to="/exchange" >
      Exchange
    </Link>
  ) : (
      <Link to="/transfer" >
        Transfer
    </Link>
    )
  return props.address ?
    (
      <div class="column small-10 text-left" style={{padding:0}}>
        <div key="1" class="column small-3">
          <a class="avatar" href="/exchange.html">
            <img src="/assets/img/address.png" />
          </a>
        </div>
        <div key="2" class="column small-9">
          <a class="short-address" href="/exchange.html">{props.address ? props.address.slice(0, 8) : ''} ... {props.address ? props.address.slice(-6) : ''}</a>
          <ul class="actions">
            <li>
              {link}
            </li>
            <li>
              <a onClick={props.endSession} class="exit">
                End Session
              </a>
            </li>
          </ul>
        </div>
      </div>
    ) : (
      <Link to="/" className="button accent" style={{marginRight: 20}}>
        Import Address
      </Link>
    )
}

export default Address