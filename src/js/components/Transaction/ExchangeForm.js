import React from "react"

const ExchangeForm = (props) => {  
  var render = (
    <div>
      <div class="frame">
        <div class="row">
          <div class="column small-11 medium-10 large-8 small-centered">
            <h1 class="title">Exchange</h1>
            <form action="#" method="get">
              <div class="row">
                <div class="column medium-6">
                  <label>Exchange From
                  
                    <div class="token-input">
                      <input type={props.input.sourceAmount.type} value={props.input.sourceAmount.value} onChange={props.input.sourceAmount.onChange}  min="0" step="0.000001" placeholder="0"/>
                      {props.tokenSource}
                    </div>
                    <div class="address-balance"><span class="note">Address Balance</span><a class="value" href="#">{props.balance} {props.sourceTokenSymbol}</a></div>
                  </label>
                </div>
                <div class="column medium-6">
                  <label>Exchange To
                    <div class="token-input">
                      <input type={props.input.destAmount.type} value={props.input.destAmount.value} readOnly min="0" step="0.000001" placeholder="0"/>
                      {/* <div class="info" data-open="exchange-to-token-modal"><img src="/assets/img/omg.svg"/><span class="name">OMG</span></div> */}
                      {props.tokenDest}
                    </div>
                  </label>
                </div>
              </div>
              <div class="row">
                {props.exchangeRate}
              </div>
              
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
            </form>
          </div>
        </div>
      </div>
      {props.exchangeButton}
      {props.selectTokenModal}
    </div>
  )
  return (

    <div class="choose-token-pair" id="exchange">
      {props.step!==3? render : ''}
      <div class="page-3">
        {props.step==3? props.trasactionLoadingScreen : ''}
      </div>
    </div>









    // <div class="k-exchange-page">
    //    	<div class="page-1" class={props.step!==1?'visible-hide':''}>
    //    		<div>
    //           {props.tokenSource}
                
	  //      		 <span>to</span>
    //             {props.tokenDest}
    //    		</div>
    //         <div>{props.errors.selectSameToken}</div>
    //         <div>{props.errors.selectTokenToken}</div>
    //         <button onClick={props.button.selectToken.onClick}>Continue</button>
    //    	</div>
    //     <div class="page-2" class={props.step!==2?'visible-hide':''}>
    //       <div>
    //         <button onClick={props.button.showAdvance.onClick}>Advance</button>
    //       </div>
    //       <h1>Exchange from</h1>
    //       <div>
    //         <div>
    //         <input type={props.input.sourceAmount.type} value={props.input.sourceAmount.value} onChange={props.input.sourceAmount.onChange} />
    //           <div>{props.tokenSource}</div>
    //           <div>{props.sourceAmount}</div>
    //         </div>
    //         <span> to</span>
    //         <div>
    //         <input value={props.input.destAmount.value} readOnly/>              
    //           {props.destAmount}
    //           {props.tokenDest} 
    //         </div>
    //       </div>
    //       <div>{props.errors.sourceAmount}</div>
    //       <div>{props.errors.tokenSource}</div>
    //       <div>
    //         {props.exchangeRate}
    //       </div>
    //       <div>
    //         {props.exchangeButton}
    //       </div>

    //     </div>
    //     <div class="page-3"  class={props.step!==3?'visible-hide':''}>
    //         {props.trasactionLoadingScreen}
    //     </div>

    //     {props.selectTokenModal}
    //     {props.changeGasModal}        
    //   </div>
  )
}

export default ExchangeForm
