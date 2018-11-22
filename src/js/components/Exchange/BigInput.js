import React from "react";
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';

const BigInput = (props) => {
  return (
    <div className={"big-input-wrapper"}>
      <Dropdown>
        <DropdownTrigger>
          <input
            className={`exchange-content__input ${props.errorExchange ? "error" : ""}`}
            min="0"
            step="0.000001"
            placeholder="0" // no auto focus
            type="text" maxLength="50" autoComplete="off"
            value={props.value}
            // onFocus={props.input.sourceAmount.onFocus}
            // onBlur={props.input.sourceAmount.onBlur}
            // onChange={handleChangeSource}
          />
          {/* <div>{props.value ? props.value.toString() : 0}</div> */}
        </DropdownTrigger>
        <DropdownContent>
          <div className={`show-item ${props.type === "dest" ? "dest-item" : ""} ${props.errorExchange ? "error": ""}`}>
            <div className={"input-content"}>
              <input
                className="big-input"
                min="0"
                step="0.000001"
                placeholder="0"
                autoFocus={props.focus === props.type}
                type="number" maxLength="50" autoComplete="off"
                value={props.value}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                onChange={props.handleChangeValue}
              />
              <div className={"token-symbol"}>
                {props.tokenSymbol}
              </div>
            </div>
            <div className={props.errorExchange ? "error" : ""}>
              {!props.isChangingWallet ? props.errorShow : ''}
            </div>
          </div>
        </DropdownContent>
      </Dropdown>
    </div>
  )
}

export default BigInput
