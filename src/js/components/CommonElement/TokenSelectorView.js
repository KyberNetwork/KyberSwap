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
          <div key={key} onClick={(e) => props.selectItem(e, item.symbol, item.address)} className="token-item">
            <div>
              <img src={require("../../../assets/img/tokens/" + item.icon)} />
              <span className="item-name">{item.name}</span>
              {item.isNotSupport &&
                <span className="unsupported">not supported</span>
              }  
            </div>
            <div>
              <span title={balance}>{roundingNumber(balance)}</span>
            </div>
          </div>
        )
      }
    })
  }

  return (
    <div className={props.open ? "open token-selector" : "close token-selector"}>
      <div className="focus-item" onClick={(e) => props.toggleOpen(e)}>
        <div>
          <img src={require("../../../assets/img/tokens/" + focusItem.icon)} />
        </div>
        <div>{focusItem.name}</div>
      </div>


      <div className="select-item">
        <div className="search-item">
          <input value={props.searchWord} placeholder="Search" onChange={(e) => props.changeWord(e)} />
        </div>
        <div className="list-item">
          {getListToken()}
        </div>
      </div>
    </div>
  )

}
export default TokenSelectorView