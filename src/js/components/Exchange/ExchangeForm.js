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
            {props.errorSelectSameToken}
            {props.errorSelectTokenToken}
       		{props.buttonStep1}
       	</div>
        <div class="page-2" class={props.step!==2?'visible-hide':''}>
          <div>
            {props.buttonShowAdvance}
          </div>
          <h1>Exchange from</h1>
          <div>
            <div>
              {props.sourceAmount}
              {props.tokenSource}             
            </div>
             <span> to</span>
            <div>
              {props.destAmount}
              {props.tokenDest} 
            </div>
          </div>
          {props.errorSelectSameToken}
          {props.errorSelectTokenToken}
          <div>
            {props.exchangeRate}
          </div>
          <div>
            {props.exchangeButton}
          </div>

        </div>
        <div class="page-3"  class={props.step!==3?'visible-hide':''}>
          step 3
        </div>

        {props.selectTokenModal}
        {props.changeGasModal}
        {props.passphraseModal}
      </div>
  )
}

export default ExchangeForm
