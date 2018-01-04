import React from "react"
import { Modal, TokenSelect } from '../CommonElement'
import constants from "../../services/constants"
import BigNumber from "bignumber.js"
import { toT, caculateTokenEpsilon } from "../../utils/converter"

const SelectTokenModal = (props) => {
  var content = () => {
    var title = ''
    var content = ''
    switch (props.type) {
      case "source":
        title = props.translate("modal.select_source_token") || "Select source token"
        //content = "source"  			
        var content = Object.keys(props.tokens).map((key, i) => {          
          var token = props.tokens[key]
          var tokenEpsilon = caculateTokenEpsilon(token.rate, token.decimal, token.symbol, token.balance)
          var balance = toT(token.balance, token.decimal)
          var balanceBig = new BigNumber(token.balance)
          return <TokenSelect key={i} symbol={token.symbol} name={token.name}
                  balance={balance} 
                  decimal={token.decimal}
                  icon={token.icon}
                  type = {props.type}
                  address = {token.address}
                  onClick = {props.chooseToken}
                  inactive = {!balanceBig.greaterThanOrEqualTo(tokenEpsilon)}
                  title={title}
                  selected={props.selected==token.symbol}
                  translate={props.translate}
                  />
        })
        break
      case "des":
        title = props.translate("modal.select_dest_token") || "Select destination token"
        var content = Object.keys(props.tokens).map((key,i) => {
          var token = props.tokens[key]
          var balance = toT(token.balance, token.decimal)
          return <TokenSelect key={i} symbol={token.symbol} name={token.name}
                  balance={balance} 
                  icon={token.icon} 
                  type = {props.type}
                  address = {token.address}
                  onClick = {props.chooseToken}
                  title={title}
                  selected={props.selected==token.symbol}
                  translate={props.translate}
                  />
        })
        break
      case "transfer":  		
        title = props.translate("modal.select_trasfer_from_token") || "SELECT \"TRANSFER FROM\" TOKEN"
        var content = Object.keys(props.tokens).map((key,i) => {
          var token = props.tokens[key]
          var balance = toT(token.balance, token.decimal)
          var balanceBig = new BigNumber(token.balance)
          return <TokenSelect key={i} symbol={token.symbol} name={token.name}
                  balance={balance} 
                  icon={token.icon} 
                  type = {props.type}
                  address = {token.address}
                  onClick = {props.chooseToken}
                  inactive = {!balanceBig.greaterThan(0)}
                  selected={props.selected==token.symbol}
                  translate={props.translate}
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