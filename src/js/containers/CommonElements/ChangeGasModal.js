import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
//import { TokenSelect } from '../../components/Token'
import { hideGasModal } from "../../actions/utilActions"
import {TransactionConfig} from "../../components/Forms/Components"
import { specifyGas as specifyGasExchange, specifyGasPrice  as specifyGasPriceExchange } from "../../actions/exchangeActions"
import { specifyGas as specifyGasTransfer, specifyGasPrice as specifyGasPriceTransfer } from "../../actions/transferActions"


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
   var modal = store.utils.gasModal
   if (!!modal){
   	return {
   		modalInfo : modal,
   		type: props.type,
   		gas: props.gas,
   		gasPrice: props.gasPrice,
   		gasPriceError : props.gasPriceError,
        gasError : props.gasError
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

export default class ChangeGasModal extends React.Component {

  closeModal = (event) => {
    this.props.dispatch(hideGasModal())
  }
  
  specifyGas = (event) => {
  	var value = event.target.value
  	if(this.props.type === "exchange"){
  		this.props.dispatch(specifyGasExchange(value))
  	}else{
  		this.props.dispatch(specifyGasTransfer(value))
  	}
  }

  specifyGasPrice = (event) => {
  	var value = event.target.value
  	if(this.props.type === "exchange"){
  		this.props.dispatch(specifyGasPriceExchange(value))
  	}else{
  		this.props.dispatch(specifyGasPriceTransfer(value))
  	}
  }

  render() {
    return (
    	<Modal  
	     	 style={customStyles}    
	         isOpen={this.props.modalInfo.open}
	          onRequestClose={this.closeModal}
             contentLabel ="change gas"
            >
	        <TransactionConfig 
	        		gas={this.props.gas}
                    gasPrice={this.props.gasPrice}                    
                    gasHandler={this.specifyGas}
                    gasPriceHandler={this.specifyGasPrice} 
                    gasPriceError = {this.props.gasPriceError}
                    gasError = {this.props.gasError}
                    />
	      </Modal>
      
    )
  }
}
