import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
import { TokenSelect } from '../../components/Token'
import { hideSelectToken } from "../../actions/utilActions"

import { Modal } from '../../components/CommonElement'

@connect((store, props) => {
  var modal = store.utils.tokenModal
  if (!!modal) {
    return {
      modalInfo: modal,
      tokens: store.tokens,
      chooseToken: props.chooseToken
    }
  }
  else {
    return {
      modalInfo: {
        open: false
      }
    }
  }
  //return store.utils
})

export default class SelectTokenModal extends React.Component {

  closeModal = (event) => {
    this.props.dispatch(hideSelectToken())
  }
  chooseToken = (event, symbol, address, type) => {
    this.props.chooseToken(symbol, address, type)
  }


  content = () => {
    if (!this.props.modalInfo.open) {
      return ''
    }

    var title = ''
    var content = ''
    switch (this.props.modalInfo.type) {
      case "source":
        title = "Select source token"
        //content = "source"  			
        var content = Object.keys(this.props.tokens).map((key, i) => {
          const token = this.props.tokens[key]
          //console.log(token)         
          return <TokenSelect key={i} symbol={token.symbol}
            balance={token.balance.toString()}
            icon={token.icon}
            type={this.props.modalInfo.type}
            address={token.address}
            onClick={this.chooseToken}
          />
        })
        break
      case "des":
        title = "Select des token"
        var content = Object.keys(this.props.tokens).map((key) => {
          const token = this.props.tokens[key]
          return <TokenSelect key={key} symbol={token.symbol}
            balance={token.balance.toString()}
            icon={token.icon}
            type={this.props.modalInfo.type}
            address={token.address}
            onClick={this.chooseToken}
          />
        })
        break
      case "transfer":
        title = "Select transfer token"
        var content = Object.keys(this.props.tokens).map((key) => {
          const token = this.props.tokens[key]
          return <TokenSelect key={key} symbol={token.symbol}
            balance={ttoken.balance.toString()}
            icon={token.icon}
            type={this.props.modalInfo.type}
            address={token.address}
            onClick={this.chooseToken}
          />
        })
        break;
    }
    return (
      <div>
        <div className="modal-message">
          {title}
        </div>
        {content}
        <div className="modal-control">
          <button className="cancel" onClick={this.closeModal}>Cancel</button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <Modal
        isOpen={this.props.modalInfo.open}
        onRequestClose={this.closeModal}
        contentLabel="select token"
        content = {this.content()}
      />

    )
  }
}
