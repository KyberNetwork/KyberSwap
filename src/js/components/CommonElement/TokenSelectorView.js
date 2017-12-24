import React from "react"

import { toT, roundingNumber } from "../../utils/converter"

const TokenSelectorView = (props) => {


  //var data = props.data
  var focusItem = props.listItem[props.focusItem]
  var listShow = {}
  Object.keys(props.listItem).map((key, i) => {
    if (props.listItem[key].name.toLowerCase().includes(props.searchWord)) {
      listShow[key] = props.listItem[key]
    }
  })

  var getListToken = () => {
    return Object.keys(listShow).map((key, i) => {
      if (key !== props.focusItem) {
        var item = listShow[key]
        var balance = toT(item.balance, item.decimal)
        return (
          <div key={key} onClick={(e) => props.selectItem(e, item.symbol, item.address)}>
            <img src={require("../../../assets/img/tokens/" + item.icon)} />
            <span>{item.name}</span>
            {item.isNotSupport &&
              <span className="unsupported">not supported</span>
            }
            <span title={balance}>{roundingNumber(balance)}</span>
          </div>
        )
      }
    })
  }

  return (
    <div className={props.open ? "open" : "close"}>
      <div>
        <img src={require("../../../assets/img/tokens/" + focusItem.icon)} />
        <span>{focusItem.name}</span>
      </div>
      <div>
        <input value={props.searchWord} placeholder="Search token" onChange={(e) => props.changeWord(e)} />
      </div>
      <div>
        {getListToken()}
      </div>
    </div>
  )

}
export default TokenSelectorView