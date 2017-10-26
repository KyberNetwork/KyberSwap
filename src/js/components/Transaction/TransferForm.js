import React from "react"

const TransferForm = (props) => {  
  var render = (
    <div>
      <div class="frame">
        <div class="row">
          <div class="column small-11 medium-10 large-8 small-centered">
            <h1 class="title">Transfer<span class="help has-tip top" data-tooltip title="To move someone or something from one place, vehicle, person, or group to another"></span></h1>
            <form action="#" method="get">
              <div class="row">
                <div class="column">
                  <label>Transfer to address
                    <input class="text-center hash" type="text" placeholder="Address Hash" value={props.input.destAddress.value} onChange={props.input.destAddress.onChange}/>
                  </label>
                </div>
              </div>
              <div class="row">
                <div class="column medium-6">
                  {props.token}
                  {/* <label>Select Token
                    <div class="token-select" data-open="transfer-from-token-modal"><img src="/assets/img/omg.svg"/><span class="name">OmiseGO</span></div>
                  </label> */}
                </div>
                <div class="column medium-6">
                  <label>Amount
                    <div class="token-amount">
                      <input type="number" min="0" step="0.000001" placeholder="0" value={props.input.amount.value} onChange={props.input.amount.onChange}/><span class="name">{props.tokenSymbol}</span>
                    </div>
                    <div class="address-balance clearfix"><span class="note">Address Balance</span><a class="value" href="#">{props.balance} {props.tokenSymbol}</a></div>
                  </label>
                </div>
              </div>
            </form>
            <div class="row hide-on-choose-token-pair">
              <div class="column">
                <div class="clearfix">
                  <div class="advanced-switch base-line float-right">
                    <div class="switch accent">
                      <input class="switch-input" id="advanced" type="checkbox"/>
                      <label class="switch-paddle" for="advanced"><span class="show-for-sr">Advanced Mode</span></label>
                    </div>
                    
                    <label class="switch-caption" for="advanced">Advanced</label>
                  </div>
                </div>
                <div class="advanced-content" disabled>
                  {props.gasConfig}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {props.transferButton}
      {props.tokenModal}
    </div>
  )
  return (
    
    <div>
      {props.step!==2? render : ''}
      <div class="page-3">
        {props.step==2? props.trasactionLoadingScreen : ''}
      </div>
    </div>



    // <div class="k-exchange-page">
    //    	<div class="page-1" class={props.step!==1?'visible-hide':''}>
    //       <div>
    //         <button onClick={props.button.showAdvance.onClick}>Advance</button>
    //       </div>
    //       <h1>Transfer to</h1>

    //       <input value={props.input.destAddress.value} onChange={props.input.destAddress.onChange} />
    //       <div>{props.errors.destAddress}</div>

    //       <h1>Amount</h1>
    //       <input value={props.input.amount.value} onChange={props.input.amount.onChange} />
    //       <div>{props.errors.amountTransfer}</div>

    //       {props.token}
    //       {props.transferButton}
    //     </div>

    //     <div class="page-2"  class={props.step!==2?'visible-hide':''}>
    //       {props.trasactionLoadingScreen}
    //     </div>

    //     {props.tokenModal}
    //     {props.changeGasModal}
    //   </div>
  )
}

export default TransferForm
