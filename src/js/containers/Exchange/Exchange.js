import React from "react"
import { connect } from "react-redux"

//import TokenDest from "./TokenDest"
//import {TokenDest, MinRate} from "../ExchangeForm"
import {Token} from "../Exchange"
import {SelectTokenModal} from "../CommonElements"

import {openTokenModal, hideSelectToken} from "../../actions/utilActions"
import { selectToken } from "../../actions/tokenActions"

@connect((store) => {
  return {...store.exchange}
})

export default class Exchange extends React.Component {
  openSourceToken = () =>{
    this.props.dispatch(openTokenModal("source"))
  }
  openDesToken = () =>{
    this.props.dispatch(openTokenModal("des"))

  }
  selectToken = (symbol) => {
    console.log(symbol)
    console.log("xxx")
    this.props.dispatch(selectToken(this.props.modalInfo.type, symbol))
     this.props.dispatch(hideSelectToken())
  }

  render() {
    return (
      <div class="k-exchange-page">
       	<div class="page-1">
       		<div>
	       		<Token type="source"
	       				token={this.props.token_source}
                onSelect={this.openSourceToken}
                 />
                
	       		 <span>to</span>
	       		 <Token type="des"
	       				token={this.props.token_des} 
                onSelect={this.openDesToken}
                />
       		</div>
       		<button>Continue</button>
       	</div>

        <SelectTokenModal selectToken ={this.selectToken}/>
      </div>
    )
  }
}
