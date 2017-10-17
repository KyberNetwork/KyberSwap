import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
import { TokenSelect } from '../../components/Token'
import { hideSelectToken } from "../../actions/utilActions"


import Modal from 'react-modal'

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(139, 87, 42, 0.55)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}

@connect((store, props) => {
   var modal = store.utils.tokenModal
   if (!!modal){
   	return {
   		modalInfo : modal,
   		tokens: store.tokens,
      selectToken: props.selectToken
   	}
   }
   else{
   	return {
   		modalInfo : {
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

  

  content = () => {
  	if (!this.props.modalInfo.open){
  		return ''
  	}

  	var title = ''
  	var content = ''
  	switch (this.props.modalInfo.type){
  		case "source":
  			title = "Select source token"
  			//content = "source"  			
		    var content = Object.keys(this.props.tokens).map((key) => {
		    	const token = this.props.tokens[key]
		      return <TokenSelect key={key} symbol={token.symbol} 
		      				balance={token.balance} 
		      				icon={token.icon} 
                  onSelected = {this.props.selectToken(key)}
                  />
		    })
  			break
  		case "des":
  			title = "Select des token"
  			var content = Object.keys(this.props.tokens).map((key) => {
		    	const token = this.props.tokens[key]
		      return <TokenSelect key={key} symbol={token.symbol} 
		      				balance={token.balance} 
		      				icon={token.icon} 
                  onSelected = {this.props.selectToken(key)}
                  />
		    })
  			break
  		case "transfer":  		
  			title = "Select transfer token"
  			var content = Object.keys(this.props.tokens).map((key) => {
		    	const token = this.props.tokens[key]
		      return <TokenSelect key={key} symbol={token.symbol} 
		      				balance={token.balance} 
		      				icon={token.icon} 
                  onSelected = {this.props.selectToken(key)}
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
	     	 style={customStyles}    
	         isOpen={this.props.modalInfo.open}
	          onRequestClose={this.closeModal}
            contentLabel ="select token"
            >
	        {this.content()} 
	      </Modal>
      
    )
  }
}
