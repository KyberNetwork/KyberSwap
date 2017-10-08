import React from "react"
import { toT } from "../../utils/converter"


const Token = (props) => {  
    return (
      <div class="token-item">
        <div class="avatar">
          <img src={props.icon} />
        </div>
        <div class="name">
          {props.name}
        </div>
        <label>Balance</label>
        <div class="value" title={toT(props.balance)}>
          {toT(props.balance, 8)}
        </div>
      </div>
    )
}

export default Token