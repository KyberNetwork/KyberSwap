import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
//import { TokenSelect } from '../../components/Token'
import { hideGasModal } from "../../actions/utilActions"
import { TransactionConfig } from "../../components/Forms/Components"
import { specifyGas as specifyGasExchange, specifyGasPrice as specifyGasPriceExchange, hideAdvance as hideAdvanceExchange } from "../../actions/exchangeActions"
import { specifyGas as specifyGasTransfer, specifyGasPrice as specifyGasPriceTransfer, hideAdvance as hideAdvanceTransfer } from "../../actions/transferActions"


import { Modal } from '../../components/CommonElement'

@connect((store, props) => {
  return props
  // return {
  // 		open : props.open,
  // 		type: props.type,
  // 		gas: props.gas,
  // 		gasPrice: props.gasPrice,
  // 		gasPriceError : props.gasPriceError,
  //      gasError : props.gasError
  // 	}
  //return store.utils
})

export default class ChangeGasModal extends React.Component {

  closeModal = (event) => {
    if (this.props.type === "exchange") {
      this.props.dispatch(hideAdvanceExchange())
    } else {
      this.props.dispatch(hideAdvanceTransfer())
    }
  }

  specifyGas = (event) => {
    var value = event.target.value
    if (this.props.type === "exchange") {
      this.props.dispatch(specifyGasExchange(value))
    } else {
      this.props.dispatch(specifyGasTransfer(value))
    }
  }

  specifyGasPrice = (event) => {
    var value = event.target.value
    if (this.props.type === "exchange") {
      this.props.dispatch(specifyGasPriceExchange(value))
    } else {
      this.props.dispatch(specifyGasPriceTransfer(value))
    }
  }

  render() {
    return (
      <Modal
        isOpen={this.props.open}
        onRequestClose={this.closeModal}
        contentLabel="change gas"
        content={
          <TransactionConfig
            gas={this.props.gas}
            gasPrice={this.props.gasPrice}
            gasHandler={this.specifyGas}
            gasPriceHandler={this.specifyGasPrice}
            gasPriceError={this.props.gasPriceError}
            gasError={this.props.gasError}
          />
        }
      />

    )
  }
}
