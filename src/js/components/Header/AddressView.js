import { NavLink, Link } from 'react-router-dom'
import React from "react"
import BLOCKCHAIN_INFO from "../../../../env"
const Address = (props) => {

  function checkCurrentLink(e){
    if(this.to == props.path){
      e.preventDefault();
    }
  }

  return props.address ?
    (
      <div class="column small-12 medium-6 large-5">
        <div class="user-bar">
          <div class="row">
            <div key="1" class="column small-2">
              <a class="avatar">
                <img src={props.parrentProps.account.avatar} />
              </a>
            </div>
            <div key="2" class="column small-8">
              <a class="short-address" target="_blank" href={BLOCKCHAIN_INFO.ethScanUrl + "/address/" + props.address}>{props.address ? props.address.slice(0, 8) : ''} ... {props.address ? props.address.slice(-6) : ''}</a>
              <ul class="actions">
                <li><NavLink to="/exchange" onClick={checkCurrentLink}>Exchange</NavLink></li>
                <li><NavLink to="/transfer" onClick={checkCurrentLink}>Transfer</NavLink></li>
                <li>
                  <a onClick={props.endSession} className="exit">
                    Exit
                  </a>
                </li>
              </ul>
            </div>
            {props.notify}
          </div>
        </div>
      </div>
    ) : (props.path === "/info" ? (
      <div class="column small-7 medium-6 large-5">
        <div class="text-right">
          <div class="user-bar">
            <Link to="/" className="button accent" style={{ marginRight: 20 }}>
              Import Address
              </Link>
          </div>
        </div>
      </div>
    ) : ''
    )
}

export default Address