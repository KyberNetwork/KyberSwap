import React from "react"

const ImportByMetamaskView = (props) => {
  return (
    <div>
      <div className="importer metamask" onClick={(e) => props.connect(e)}>
        <div className="importer__symbol">
          <img src={require('../../../assets/img/landing/metamask_active.svg')} />
          <div className="importer__name">{props.translate("import.from_metamask") || "Metamask"}</div>
        </div>
        <div className="importer__button">{props.translate("import.connect") || "Connect"}</div>

        {/*<div className="more-info">*/}
          {/*{props.metamask.error !== "" && (*/}
            {/*<div className="error">{props.metamask.error}</div>*/}
          {/*)}*/}
          {/*{props.metamask.error === "" && (*/}
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
    </div>
  )
}

export default ImportByMetamaskView
