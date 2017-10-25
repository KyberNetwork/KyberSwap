import React from "react"

const TransferForm = (props) => {  
  return (
    <div class="k-exchange-page">
       	<div class="page-1" class={props.step!==1?'visible-hide':''}>
          <div>
            <button onClick={props.button.showAdvance.onClick}>Advance</button>
            {/*{props.showAdvanceBtn}*/}
          </div>
          <h1>Transfer to</h1>
          {/*{props.destAddress}
          {props.errorDestAddress}*/}

          <input value={props.input.destAddress.value} onChange={props.input.destAddress.onChange} />
          <div>{props.errors.destAddress}</div>

          <h1>Amount</h1>
          <input value={props.input.amount.value} onChange={props.input.amount.onChange} />
          <div>{props.errors.amountTransfer}</div>

          {/*{props.amount}
          {props.errorAmount}*/}
          {props.token}
          {props.transferButton}
        </div>

        <div class="page-2"  class={props.step!==2?'visible-hide':''}>
          {props.trasactionLoadingScreen}
        </div>

        {props.tokenModal}
        {props.changeGasModal}
        
        
      </div>
  )
}

export default TransferForm
