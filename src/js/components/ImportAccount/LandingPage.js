import React from "react"

const LandingPage = (props)=> {
  return (
    <div id="get-start">
        <div class="frame">
            <div className="row">
                <div className="column text-center">
                    <h3 class="title">{props.translate("landing_page.title") || "Trust-Free Exchange  for Ethereum tokens"}</h3>
                        <ul class="show-for-medium">
                            <li class="">{props.translate("landing_page.trustless") || "Trustless"}</li>
                            <li class="">{props.translate("landing_page.instant") || "Instant"}</li>
                            <li class="">{props.translate("landing_page.liquid") || "Liquid"}</li>
                            <li class="">{props.translate("landing_page.compatible") || "Compatible"}</li>
                        </ul>
                    <button class="button accent" onClick={(e)=>props.goExchange(e)}>{props.translate("landing_page.get_started") || "Get Started"}</button>
                </div>
            </div>
        </div>
    </div>
  )
  
}
export default LandingPage