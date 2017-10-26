import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
import { TokenSelect } from '../../components/CommonElement'
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
                  type = {this.props.modalInfo.type}
                  address = {token.address}
                  onClick = {this.chooseToken}
                  inactive = {token.balance.equals(0)}
                  title={title}
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
                  type = {this.props.modalInfo.type}
                  address = {token.address}
                  onClick = {this.chooseToken}
                  title={title}
                  />
		    })
  			break
  		case "transfer":  		
  			title = "SELECT \"TRANSFER FROM\" TOKEN"
  			var content = Object.keys(this.props.tokens).map((key) => {
		    	const token = this.props.tokens[key]
		      return <TokenSelect key={key} symbol={token.symbol} name={token.name}
		      				balance={token.balance.toString()} 
		      				icon={token.icon} 
                  type = {this.props.modalInfo.type}
                  address = {token.address}
                  onClick = {this.chooseToken}
                  inactive = {token.balance.equals(0)}
                  />
		    })
  			break;
  	}
    return (
      <div>
        <div class="title">{title}</div><a class="x" href="#" data-close>&times;</a>
        <div class="content">
          <div class="row tokens small-up-2 medium-up-3 large-up-4">
              {content}
              <div className="modal-control">
              <button className="cancel" onClick={this.closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      </div>






      // <div>
      //   {content}
      //   <div className="modal-control">
      //     <button className="cancel" onClick={this.closeModal}>Cancel</button>
      //   </div>
      // </div>
    )
  }

  render() {
    return (
      <Modal className={{base: 'reveal large',
              afterOpen: 'reveal large'}}
        isOpen={this.props.modalInfo.open}
        onRequestClose={this.closeModal}
        contentLabel="select token"
        content = {this.content()}
        type="selectToken"
      />

    )
  }
}
