import React from "react"

const TokenView = (props) => {
  var tokenRender
  if (props.token){
    if(props.type == 'transfer'){
      return (
        <label>{props.translate("transaction.select_token") ||"Select Token"}
          <div onClick={props.onSelected} className="token-select" data-open="transfer-from-token-modal"><img src={require('../../../assets/img/tokens/' + props.token.icon)}/><span class="name">{props.token.name}</span></div>
        </label>
      )
    } else if(props.type == 'source'){
      return (
        <div class="info" onClick={props.onSelected} data-open="exchange-from-token-modal"><img src={require('../../../assets/img/tokens/' + props.token.icon)}/><span class="name">{props.symbol}</span></div>
      )
    } else if(props.type == 'des'){
      return (
        <div class="info" onClick={props.onSelected} data-open="exchange-to-token-modal"><img src={require('../../../assets/img/tokens/' + props.token.icon)}/><span class="name">{props.symbol}</span></div>
      )
    }
    
  }
      
  return (
    <div>
      {tokenRender}
    </div>      
  )
}

export default TokenView;