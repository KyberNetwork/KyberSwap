import React from "react"
import { Modal, TokenSelect } from '../CommonElement'
import constants from "../../services/constants"
import BigNumber from "bignumber.js"
import * as converter from "../../utils/converter"

const SelectTokenModal = (props) => {
  var content = () => {
    var title = ''
    var content = ''
    switch (props.type) {
      case "source":
        title = "Select source token"
        //content = "source"  			
        var content = Object.keys(props.tokens).map((key, i) => {          
          var token = props.tokens[key]
          var tokenEpsilon = converter.caculateTokenEpsilon(token.rate, token.decimal)
          //console.log(token.balance.times(token.rate).toString())
          //console.log(token.name)
          return <TokenSelect key={i} symbol={token.symbol} name={token.name}
                  balance={token.balance.toString()} 
                  decimal={token.decimal}
                  icon={token.icon}
                  type = {props.type}
                  address = {token.address}
                  onClick = {props.chooseToken}
                  inactive = {!token.balance.greaterThanOrEqualTo(tokenEpsilon)}
                  title={title}
                  selected={props.selected==token.symbol}
                  />
        })
        break
      case "des":
        title = "Select destination token"
        var content = Object.keys(props.tokens).map((key,i) => {
          var token = props.tokens[key]
          return <TokenSelect key={i} symbol={token.symbol} name={token.name}
                  balance={token.balance.toString()} 
                  decimal={token.decimal}
                  icon={token.icon} 
                  type = {props.type}
                  address = {token.address}
                  onClick = {props.chooseToken}
                  title={title}
                  selected={props.selected==token.symbol}
                  />
        })
        break
      case "transfer":  		
        title = "SELECT \"TRANSFER FROM\" TOKEN"
        var content = Object.keys(props.tokens).map((key,i) => {
          var token = props.tokens[key]
          return <TokenSelect key={i} symbol={token.symbol} name={token.name}
                  balance={token.balance.toString()} 
                  decimal={token.decimal}
                  icon={token.icon} 
                  type = {props.type}
                  address = {token.address}
                  onClick = {props.chooseToken}
                  inactive = {!token.balance.greaterThan(0)}
                  selected={props.selected==token.symbol}
                  />
        })
      }
      return (
        <div>
          <div class="title">{title}</div><a className="x" onClick={props.closeModal}>&times;</a>
          <div class="content">
            <div class="row tokens small-up-2 medium-up-3 large-up-4">
                {content}
            </div>
          </div>
        </div>
      )
    }

  return (
    <Modal className={{base: 'reveal large',
        afterOpen: 'reveal large'}}
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
        contentLabel="select token"
        content = {content()}
        size="large"
        />
  )
}

export default SelectTokenModal