import React from "react"

const TransferForm = (props) => {  
  return (
    <div class="k-exchange-page">
       	<div class="page-1" class={props.step!==1?'visible-hide':''}>
          <div>
            {props.showAdvanceBtn}
          </div>
          <h1>Transfer to</h1>
          {props.destAddress}
          {props.errorDestAddress}
          <h1>Amount</h1>
          {props.amount}
          {props.errorAmount}
          {props.token}
          {props.transferBtn}
        </div>

        <div class="page-2"  class={props.step!==2?'visible-hide':''}>
          {props.trasactionLoadingScreen}
        </div>

        {props.tokenModal}
        {props.changeGasModal}
        {props.passPhraseModal}
        
        
      </div>
  )
}

export default TransferForm
