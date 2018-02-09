import React from "react"
import { toT, roundingNumber } from "../../utils/converter"

const TokenSelectorView = (props) => {
  var focusItem = props.listItem[props.focusItem]
  var listShow = {}
  Object.keys(props.listItem).map((key, i) => {
    var token = props.listItem[key],
        matchName = token.name.toLowerCase().includes(props.searchWord),
        matchSymbol = token.symbol.toLowerCase().includes(props.searchWord)
    if (matchSymbol || matchName) {
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
              <span className="item-icon">
                <img src={require("../../../assets/img/tokens/" + item.icon)} />
              </span>
              <span className="item-name">
                <span className="font-w-b">{item.symbol}</span><span className="show-for-large token-name"> - {item.name}</span></span>
              {item.isNotSupport &&
                <span className="unsupported">{props.translate("error.not_supported") || "not supported"}</span>
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
      <div className="focus-item d-flex" onClick={(e) => props.toggleOpen(e)}>
        <div className="icon">
          <img src={require("../../../assets/img/tokens/" + focusItem.icon)} />
        </div>
        <div className="mr-auto"><span className="font-w-b">{focusItem.symbol}</span><span className="show-for-large token-name"> - {focusItem.name}</span></div>
        <div><i className={'k k-angle white ' + (props.open ? 'up' : 'down')}></i></div>
      </div>


      <div className="select-item">
        <div className="search-item">
          <input value={props.searchWord} placeholder="Search" onChange={(e) => props.changeWord(e)} />
        </div>
        <div className="list-item custom-scroll">
          {getListToken()}
        </div>
      </div>
    </div>
  )

}
export default TokenSelectorView