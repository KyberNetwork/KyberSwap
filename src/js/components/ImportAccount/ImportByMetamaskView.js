import React from "react"
//import ReactTooltip from 'react-tooltip'

const ImportByMetamaskView = (props) => {
    return (
        <div className="column column-block">
            <div className="importer metamask">
              {/*<div className="how-to-use" data-tip="How to use" data-for="metamask-tip"></div>*/}
              <div className="importer__symbol">
                <img src={require('../../../assets/img/landing/metamask_active.svg')} />
                <div className="importer__name">{props.translate("import.from_metamask") || "METAMASK"}</div>
              </div>
              <button className="importer__button" onClick={(e) => props.connect(e)}>{props.translate("import.connect") || "Connect"}</button>

               <div className="more-info">
              {props.metamask.error !== "" && (
                  <div className="error">{props.metamask.error}</div>
              )}
              {props.metamask.error === "" && (
                  <div className="info">
                      <div className="address">
                          <div>{props.translate("import.address") || "Address"}:</div>
                          <div>{props.metamask.address.slice(0, 8)}...{props.metamask.address.slice(-6)}</div>
                      </div>
                      <div className="address">
                        <div><b>{props.translate("import.balance") || "Balance"}: {props.metamask.balance} ETH</b></div>
                      </div>
                  </div>
              )}
              </div>
            </div>
            {/* <ReactTooltip place="top" id="metamask-tip" type="dark" /> */}
        </div>
    )
}

export default ImportByMetamaskView
