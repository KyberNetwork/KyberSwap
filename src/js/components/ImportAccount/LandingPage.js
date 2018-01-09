import React from "react"

const LandingPage = (props)=> {
  return (
    <div class="frame" id="get-start">
        <div className="row">
            <div className="column text-center">
                <h3 class="title">Trust-Free Exchange  for Ethereum tokens</h3>
                    <ul class="show-for-medium">
                        <li class="">Trustless</li>
                        <li class="">Instant</li>
                        <li class="">Liquid</li>
                        <li class="">Compatible</li>
                    </ul>
                <button class="button accent" onClick={(e)=>props.goExchange(e)}>Get Started</button>
            </div>
        </div>
    </div>
  )
  
}
export default LandingPage