import React from "react"

const ImportByMetamaskView = (props) => {
  return (
    <div>
      <div className="import-account__block" onClick={(e) => props.connect(e)}>
        <div className="import-account__icon metamask"/>
        <div className="import-account__name">
            <h3>
              {props.translate("import.from_metamask") || "METAMASK"}
            </h3>
          </div>
      </div>

      {/*<div className="more-info">*/}
        {/*{props.metamask.address && (*/}
          {/*<div className="info">*/}
            {/*<div className="address">*/}
              {/*<div>{props.translate("import.address") || "Address"}:</div>*/}
              {/*<div>{props.metamask.address.slice(0, 8)}...{props.metamask.address.slice(-6)}</div>*/}
            {/*</div>*/}
            {/*<div className="address">*/}
              {/*<div><b>{props.translate("import.balance") || "Balance"}: {props.metamask.balance} ETH</b></div>*/}
            {/*</div>*/}
          {/*</div>*/}
        {/*)}*/}
      {/*</div>*/}
    </div>
  )
}

export default ImportByMetamaskView
