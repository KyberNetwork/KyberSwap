import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'

import * as converters from "../../utils/converter"


@connect((store) => {
    const account = store.account.account
    const translate = getTranslate(store.locale)
    const tokens = store.tokens.tokens
    const limitOrder = store.limitOrder
    const ethereum = store.connection.ethereum      

    return {
        translate, limitOrder, tokens, account, ethereum        

    }
})


export default class LimitOrderCompareRate extends React.Component {



    render() {
        if (this.props.limitOrder.isSelectToken) {
            return (
                <div className={"limit-order-compare-rate"}>
                    <div>
                        Current Rate: 1 {this.props.limitOrder.sourceTokenSymbol} = <span className="rate-loading"> <img src={require('../../../assets/img/waiting-white.svg')} /></span> {this.props.limitOrder.destTokenSymbol}
                    </div>
                </div>
            )
        }

        if (!this.props.limitOrder.isSelectToken && this.props.limitOrder.offeredRate == 0){
            return (
                <div className={"limit-order-compare-rate"}>
                    This pair is currently not supported by market
                </div>
            )
        }
     

        if (!this.props.limitOrder.isSelectToken && this.props.limitOrder.offeredRate != 0) {
            var triggerRate = converters.roundingRate(this.props.limitOrder.triggerRate)
            var percentChange = converters.percentChange(triggerRate, this.props.limitOrder.offeredRate)
            var expectedRate = converters.toT(this.props.limitOrder.offeredRate)
            return (
                <div className={"limit-order-compare-rate"}>
                    <div>
                        Current Rate: 1 {this.props.limitOrder.sourceTokenSymbol} = {converters.roundingNumber(expectedRate)} {this.props.limitOrder.destTokenSymbol}
                    </div>
                    
                    {percentChange > 0 && (
                        <div>
                            Your price is {percentChange}% higher than current Market
                        </div>                    
                    )}
                    

                </div>
            )
        }

    }
}
