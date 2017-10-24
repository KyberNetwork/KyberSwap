import React from "react"

const ExchangeForm = (props) => {  
  return (
    <div class="k-exchange-page">
       	<div class="page-1" class={props.step!==1?'visible-hide':''}>
       		<div>
              {props.tokenSource}
                
	       		 <span>to</span>
                {props.tokenDest}
       		</div>
            <div>{props.errors.selectSameToken}</div>
            <div>{props.errors.selectTokenToken}</div>

            {/* {props.errorSelectSameToken}
            {props.errorSelectTokenToken} 
            {props.buttonStep1} */}
            <button onClick={props.button.selectToken.onClick}>Continue</button>
       	</div>
        <div class="page-2" class={props.step!==2?'visible-hide':''}>
          <div>
            {/*{props.buttonShowAdvance}*/}
            <button onClick={props.button.showAdvance.onClick}>Advance</button>
          </div>
          <h1>Exchange from</h1>
          <div>
            <div>
              {/* <div>{props.errors.sourceAmount}</div>
              <div>{props.errors.tokenSource}</div> */}

              <input type={props.input.sourceAmount.type} value={props.input.sourceAmount.value} onChange={props.input.sourceAmount.onChange} />
              <input value={props.input.destAmount.value} />
            </div>
             <span> to</span>
            <div>
              {props.destAmount}
              {props.tokenDest} 
            </div>
          </div>
          {props.errorSelectSameToken}
          {props.errorSelectTokenToken}
          {props.errorSourceAmount}
          <div>
            {props.exchangeRate}
          </div>
          <div>
            {props.exchangeButton}
          </div>

        </div>
        <div class="page-3"  class={props.step!==3?'visible-hide':''}>
            {props.trasactionLoadingScreen}
        </div>

        {props.selectTokenModal}
        {props.changeGasModal}        
      </div>
  )
}

export default ExchangeForm
