import React from "react"
import { connect } from "react-redux"
import * as limitOrderActions from "../../actions/limitOrderActions"
import * as common from "../../utils/common"
import { getTranslate } from 'react-localize-redux'
import * as converter from "../../utils/converter"

@connect((store, props) => {
  const account = store.account.account
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const limitOrder = store.limitOrder
  const ethereum = store.connection.ethereum

  return {
      translate, limitOrder, tokens, account, ethereum,
      global: store.global

  }
})



export default class LimitOrderFee extends React.Component {

  componentDidMount = () =>{
    if (common.isUserLogin() && this.props.account !== false){
      this.props.dispatch(limitOrderActions.fetchFee(this.props.account.address, this.props.limitOrder.sourceTokenSymbol, this.props.limitOrder.destTokenSymbol))
    }
    
  }


    render() {
      var calculateFee = (this.props.limitOrder.orderFee * this.props.limitOrder.sourceAmount) / 100
      calculateFee = converter.roundingNumber(calculateFee)
      var sourceAmount = converter.roundingNumber(this.props.limitOrder.sourceAmount)
      if (calculateFee == 0){
        return ""
      }
      if (this.props.limitOrder.isFetchingFee) {
        return (
          <div className={"limit-order-fee"}>
            <div>
              Fee: <img src={require('../../../assets/img/waiting-white.svg')} />
            </div>
            <div>
              Buy 3000KNC to discount 50% for 20 orders
            </div>
          </div>
        )
      }else{
        return (
          <div className={"limit-order-fee"}>
              <div>
                Fee: {calculateFee} {this.props.limitOrder.sourceTokenSymbol} ({this.props.limitOrder.orderFee}% of {sourceAmount})
              </div>
              <div>
                Buy 3000KNC to discount 50% for 20 orders
              </div>
          </div>
        )
        
      }
      
    }
  }
