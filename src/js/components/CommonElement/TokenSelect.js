import React from "react"
import { roundingNumber } from "../../utils/converter"

const TokenSelect = (props) => {
  var handleOnClick = (e) => {
    if (props.inactive) {
      e.preventDefault();
    } else {
      props.onClick(e, props.symbol, props.address, props.type)
    }
  }
  var balance = () => {
    return roundingNumber(props.balance)
  }
  return (
    <div class="column gutter-15">
      <a className={"token-stamp " + (props.inactive ? "empty" : (props.selected ? "selected" : ""))} onClick={(e) => { handleOnClick(e) }}>
        <img src={props.icon} /><span class="name">{props.name}</span>
        <div class="balance" title={props.balance}>
          <span>{props.translate("transaction.balance") || 'Balance'}</span>
          {balance()}
        </div>
      </a>
    </div>
  )
}

export default TokenSelect
