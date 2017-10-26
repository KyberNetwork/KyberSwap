import { Link } from 'react-router-dom'
import React from "react"


const Address = (props) => {

  return props.address ?
    (
      <div class="column small-10">
        <div key="1" class="column small-3">
          <a class="avatar" href="/exchange.html">
            <img src="/assets/img/address.png"/>
          </a>
        </div>
        <div key="2" class="column small-9">
          <a class="short-address" href="/exchange.html">{props.address ? props.address.slice(0,8):''} ... {props.address? props.address.slice(-6):''}</a>
          <ul class="actions">
            <li><Link to="/transfer" >
                  Transfer
                </Link>
            </li>
            <li><a onClick={props.endSession} class="exit">
                  End Session
                </a>
            </li>
          </ul>
        </div>
      </div>
    ) : (
      <div class="column small-10">
        <div class="user-bar text-right"><a class="button accent" href="/import-address.html">Import Address</a></div>  
      </div>
    )
}

export default Address