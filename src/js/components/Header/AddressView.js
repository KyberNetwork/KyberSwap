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
      // <div class="column small-10">
      <div class="user-bar">
        <div class="row">
          <div key="1" class="column small-2">
            <a class="avatar" href="/exchange.html">
              <img src="/assets/img/address.png" />
            </a>
          </div>
          <div key="2" class="column small-8">
            <a class="short-address" href="/exchange.html">{props.address ? props.address.slice(0,8):''} ... {props.address? props.address.slice(-6):''}</a>
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
          {props.notify}
        </div>
      </div>
    ) : (
      <div class="text-right">
        <div class="user-bar">
          <Link to="/" className="button accent" style={{marginRight: 20}}>
            Import Address
          </Link>
        </div>
      </div>
      
    )
}

export default Address