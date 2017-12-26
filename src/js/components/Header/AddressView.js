import { NavLink, Link } from 'react-router-dom'
import React from "react"
import BLOCKCHAIN_INFO from "../../../../env"
const Address = (props) => {

  function checkCurrentLink(e) {
    if (this.to == props.path) {
      e.preventDefault();
    }
  }

  return props.address ?
    (
      <div class="float-right">
        <div class="user-bar">
          <span class="text-light font-w-b">ADDRESS</span>
          <a class="short-address mx-3" target="_blank" href={BLOCKCHAIN_INFO.ethScanUrl + "/address/" + props.address}>{props.address ? props.address.slice(0, 8) : ''} ... {props.address ? props.address.slice(-6) : ''}</a>
          <a onClick={props.endSession} className="exit mr-3">
            {props.translate("transaction.exit") || "Exit"}
          </a>
          {props.notify}
        </div>
      </div>
    ) : (props.path === "/info" ? (
      <div class="column small-7 medium-6 large-5">
        <div class="text-right">
          <div class="user-bar">
            <Link to="/" className="button accent" style={{ marginRight: 20 }}>
              {props.translate("address.import_address") || "Import Address"}
            </Link>
          </div>
        </div>
      </div>
    ) : ''
    )
}

export default Address