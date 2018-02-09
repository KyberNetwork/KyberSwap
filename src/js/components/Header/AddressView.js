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
      <div className="column small-9">
        <div className="user-bar text-right">
          <div className="address d-inline-block">
            <div className="float-left-md">{props.translate("address.address") || "ADDRESS"}</div>
            <div className="float-right-md">
              <a className="short-address" target="_blank" href={BLOCKCHAIN_INFO.ethScanUrl + "address/" + props.address}>{props.address ? props.address.slice(0, 8) : ''} ... {props.address ? props.address.slice(-6) : ''}</a>
            </div>
          </div>
          <a onClick={props.endSession} className="exit mr-3">
            {props.translate("transaction.exit") || "Exit"}
          </a>
          {props.notify}
        </div>
      </div>
    ) : (props.path === "/info" ? (
      <div className="column small-7 medium-6 large-5">
        <div className="text-right">
          <div className="user-bar">
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