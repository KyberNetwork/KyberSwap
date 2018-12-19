import React from "react";
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';

const BigInput = (props) => {
  var id = `${props.type}-amount-input`
  function focusInputElement(e) {
    var element = document.getElementById(id)
    if (element) {
      element.focus()
    }
  }

  return (
    <div className={"big-input-wrapper"}>
      {/* <Dropdown onShow = {(e) => focusInputElement()}>
        <DropdownTrigger>
          {props.type === "recieve-addr" ? 
            <input
              className={`exchange-content__input ${props.errorExchange ? "error" : ''}`}
              value={props.value}
              placeholder="0x0de..."
              onFocus={props.onFocus}
            />
            :
            <input
              className={`exchange-content__input ${props.errorExchange ? "error" : ""}`}
              min="0"
              step="0.000001"
              placeholder="0" // no auto focus
              type="text" maxLength="50" autoComplete="off"
              value={props.value}
              onFocus={props.onFocus}
              // onBlur={props.input.sourceAmount.onBlur}
              // onChange={handleChangeSource}
            />
          }
        </DropdownTrigger>
        <DropdownContent>
          <div className={`show-item ${props.type === "dest" ? "dest-item" : ""} 
            ${props.type === "recieve-addr" ? "recieve-addr" : ""} 
            ${props.errorExchange ? "error": ""}`}>
            <div className={"input-content"}>
              {props.type === "recieve-addr" ? 
                <input
                  className="big-input"
                  id={id}
                  placeholder="0x0de..."
                  value={props.value}
                  // onFocus={props.onFocus}
                  onChange={props.handleChangeValue}
                />
                :
                <input
                  className="big-input"
                  id={id}
                  min="0"
                  step="0.000001"
                  placeholder="0"
                  type="number" maxLength="50" autoComplete="off"
                  value={props.value}
                  // onFocus={props.onFocus}
                  onBlur={props.onBlur}
                  onChange={props.handleChangeValue}
                />
              }
              {props.type !== "recieve-addr" && <div className={"token-symbol"}>
                {props.tokenSymbol}
              </div>}
            </div>
            <div className={props.errorExchange ? "error" : ""}>
              {!props.isChangingWallet ? props.errorShow : ''}
            </div>
          </div>
        </DropdownContent>
      </Dropdown> */}
      <div className={`show-item ${props.type === "dest" ? "dest-item" : ""} 
        ${props.type === "recieve-addr" ? "recieve-addr" : ""} 
        ${props.errorExchange ? "error": ""}`}>
        <div className={"input-content"}>
          {props.type === "recieve-addr" ? 
            <input
              className="big-input"
              id={id}
              placeholder="0x0de..."
              value={props.value}
              // onFocus={props.onFocus}
              onChange={props.handleChangeValue}
            />
            :
            <input
              className="big-input"
              id={id}
              min="0"
              step="0.000001"
              placeholder="0"
              type="number" maxLength="50" autoComplete="off"
              value={props.value}
              // onFocus={props.onFocus}
              onBlur={props.onBlur}
              onChange={props.handleChangeValue}
            />
          }
          {/* {props.type !== "recieve-addr" && <div className={"token-symbol"}>
            {props.tokenSymbol}
          </div>} */}
        </div>
        <div className={props.errorExchange ? "error" : ""}>
          {!props.isChangingWallet ? props.errorShow : ''}
        </div>
      </div>
    </div>
  )
}

export default BigInput
