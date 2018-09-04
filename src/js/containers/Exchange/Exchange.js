import React from "react"
import { connect } from "react-redux"
import {ExchangeBody} from "../Exchange"
//import {GasConfig} from "../TransactionCommon"




//import {TransactionLayout} from "../../components/TransactionCommon"
import { getTranslate } from 'react-localize-redux'

import * as converter from "../../utils/converter"
import * as validators from "../../utils/validators"
import * as exchangeActions from "../../actions/exchangeActions"
// import { default as _ } from 'underscore'
import { clearSession } from "../../actions/globalActions"



import {HeaderTransaction} from "../TransactionCommon"
import * as analytics from "../../utils/analytics"


@connect((store, props) => {
  //console.log(props)
  // var langs = store.locale.languages
  // const currentLang = langs.map((item) => {
  //   if (item.active) {
  //     return item.code
  //   }
  // })
  const account = store.account.account
  // if (account === false) {
  //   console.log("go to exchange")
    // if (currentLang[0] === 'en') {
    //   window.location.href = "/swap"  
    // } else {
    //   window.location.href = `/swap?lang=${currentLang}`
    // }
 // }
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const exchange = store.exchange
  const ethereum = store.connection.ethereum
  
  return {
      translate, exchange, tokens, account, ethereum,
      params: {...props.match.params},

  }  
})


export default class Exchange extends React.Component {
  // constructor(props){
  //   super(props)
  //   this.state = {
  //     selectedGas: props.exchange.gasPrice <= 20? "f": "s", 
  //   }
  // }

  componentDidMount = () =>{
    if ((this.props.params.source.toLowerCase() !== this.props.exchange.sourceTokenSymbol.toLowerCase()) || 
        (this.props.params.dest.toLowerCase() !== this.props.exchange.destTokenSymbol.toLowerCase()) ){
          
          var sourceSymbol = this.props.params.source.toUpperCase()
          var sourceAddress = this.props.tokens[sourceSymbol].address

          var destSymbol = this.props.params.dest.toUpperCase()
          var destAddress = this.props.tokens[destSymbol].address

          this.props.dispatch(exchangeActions.selectTokenAsync(sourceSymbol, sourceAddress, "source", this.props.ethereum))
          this.props.dispatch(exchangeActions.selectTokenAsync(destSymbol, destAddress, "des", this.props.ethereum))
    }
  }
  // validateTxFee = (gasPrice) => {
  //   var validateWithFee = validators.verifyBalanceForTransaction(this.props.tokens['ETH'].balance, this.props.exchange.sourceTokenSymbol,
  //   this.props.exchange.sourceAmount, this.props.exchange.gas + this.props.exchange.gas_approve, gasPrice)

  //   if (validateWithFee) {
  //     this.props.dispatch(exchangeActions.thowErrorEthBalance("error.eth_balance_not_enough_for_fee"))
  //     return
  //     // check = false
  //   }
  // }
  // lazyValidateTransactionFee = _.debounce(this.validateTxFee, 500)



  // handleEndSession = () => {
  //   this.props.dispatch(clearSession())
  // }

  render() {    
    // if (this.props.exchange.isOpenImportAcount){
    //   return <ImportAccount screen="exchange"/>
    // }

    var exchangeBody = <ExchangeBody  />

    var headerTransaction = <HeaderTransaction page="exchange" />

    return (
      <div class="frame exchange-frame">  
        {headerTransaction}
        <div className="row">
          {exchangeBody}
        </div>
      </div>     
    )
  }
}
