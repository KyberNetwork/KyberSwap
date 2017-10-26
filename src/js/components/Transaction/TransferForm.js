import React from "react"

const TransferForm = (props) => {  
  return (
    // <div>
    //   <div class="frame">
    //     <div class="row">
    //       <div class="column small-11 medium-10 large-8 small-centered">
    //         <h1 class="title">Transfer<span class="help has-tip top" data-tooltip title="To move someone or something from one place, vehicle, person, or group to another"></span></h1>
    //         <form action="#" method="get">
    //           <div class="row">
    //             <div class="column">
    //               <label>Transfer to address
    //                 <input class="text-center hash" type="text" placeholder="Address Hash"/>
    //               </label>
    //             </div>
    //           </div>
    //           <div class="row">
    //             <div class="column medium-6">
    //               <label>Select Token
    //                 <div class="token-select" data-open="transfer-from-token-modal"><img src="/assets/img/omg.svg"/><span class="name">OmiseGO</span></div>
    //               </label>
    //             </div>
    //             <div class="column medium-6">
    //               <label>Amount
    //                 <div class="token-amount">
    //                   <input type="number" min="0" step="0.000001" placeholder="0"/><span class="name">OMG</span>
    //                 </div>
    //                 <div class="address-balance clearfix"><span class="note">Address Balance</span><a class="value" href="#">0.123456 ETH</a></div>
    //               </label>
    //             </div>
    //           </div>
    //         </form>
    //         <div class="row hide-on-choose-token-pair">
    //           <div class="column">
    //             <div class="clearfix">
    //               <div class="advanced-switch base-line float-right">
    //                 <div class="switch accent">
    //                   <input class="switch-input" id="advanced" type="checkbox"/>
    //                   <label class="switch-paddle" for="advanced"><span class="show-for-sr">Advanced Mode</span></label>
    //                 </div>
    //                 <label class="switch-caption" for="advanced">Advanced</label>
    //               </div>
    //             </div>
    //             <div class="advanced-content" disabled>
    //               <div class="transaction-fee">
    //                 <label class="title">Transaction Fee<span class="help has-tip top" data-tooltip title="To move someone or something from one place, vehicle, person, or group to another"></span></label>
    //                 <div class="gas-limit">
    //                   <input type="number" min="0" max="3000000" step="1000000" placeholder="3,000,000"/>
    //                 </div>
    //                 <div class="symbol">×</div>
    //                 <div class="gas-price">
    //                   <input type="number" min="0" max="99" step="0.1" placeholder="0.2"/>
    //                 </div><span class="result">0.123456 ETH</span>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <div class="row">
    //     <div class="column small-11 medium-10 large-9 small-centered text-center">
    //       <p class="note">Passphrase is needed for each transfer transaction</p><a class="button accent" href="#" data-open="passphrase-modal">Transfer</a>
    //     </div>
    //   </div>
    // </div>




    <div class="k-exchange-page">
       	<div class="page-1" class={props.step!==1?'visible-hide':''}>
          <div>
            <button onClick={props.button.showAdvance.onClick}>Advance</button>
          </div>
          <h1>Transfer to</h1>

          <input value={props.input.destAddress.value} onChange={props.input.destAddress.onChange} />
          <div>{props.errors.destAddress}</div>

          <h1>Amount</h1>
          <input value={props.input.amount.value} onChange={props.input.amount.onChange} />
          <div>{props.errors.amountTransfer}</div>

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
