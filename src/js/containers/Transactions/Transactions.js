import React from "react"
import { connect } from "react-redux"
import * as _ from "underscore"
//import Modal from '../../components/Elements/Modal'
import {Modal} from '../CommonElements'

import { openModal, setDataModal } from "../../actions/utilActions"
import { closeModal } from "../../actions/utilActions"

import {getToken, toEther, hexToNumber} from '../../utils/converter'

import {TransactionCom, TransactionJoinKyber, TransactionSend} from "../../components/Transactions"

@connect((store) => {
  var nonceToTxs= {}
  var sortedTxs = _.sortBy(store.txs, (tx) => {
    return tx.nonce
  }).reverse()
  return {
    txs: sortedTxs,
    utils: store.utils,
    modalId:"new_transaction_modal",
  }
})
export default class Transactions extends React.Component {
  showDetailInfo = (tx, event) => {
    switch(tx.type) {
      case "join kyber wallet": {
        var convertedTx = tx
        // convertedTx.gasPrice = toEther(convertedTx.gasPrice)
        convertedTx.gas = hexToNumber(convertedTx.gas)
        break
      }
      case "exchange": {
        var convertedTx = tx        
        convertedTx.gas = hexToNumber(convertedTx.gas)
        // convertedTx.gasPrice = toEther(convertedTx.gasPrice)
        convertedTx.data.minConversionRate = hexToNumber(convertedTx.data.minConversionRate)
        convertedTx.data.sourceAmount = hexToNumber(convertedTx.data.sourceAmount)
        convertedTx.data.maxDestAmount = hexToNumber(convertedTx.data.maxDestAmount)
        break
      }
      case "send": {
        var convertedTx = tx
        convertedTx.gas = hexToNumber(convertedTx.gas)
        convertedTx.data.sourceAmount = hexToNumber(convertedTx.data.sourceAmount)
        // convertedTx.gasPrice = toEther(convertedTx.gasPrice)
        break
      }
    }
    this.props.dispatch(setDataModal(this.props.modalId, convertedTx))
    this.props.dispatch(openModal(this.props.modalId))
  }

  closeModal = (event) =>{
    this.props.dispatch(closeModal(this.props.modalId))
  }

  content = () => {
    if(!this.props.utils[this.props.modalId]){
      return ""
    }
    var data = this.props.utils[this.props.modalId].data
    var content
    switch(data.type){
      case "join kyber wallet":
        content = <TransactionJoinKyber data={data} click={this.closeModal}/>
        break
      case "exchange": case "send":
        content = <TransactionSend data={data} click={this.closeModal}/>
        break
    }
    return content
  }


  render() {
    var txs = this.props.txs.map((tx) =>
      <TransactionCom key={tx.hash} tx={tx} click={this.showDetailInfo.bind(null,tx)}/>
    )
    return (
    <div class="k-page k-page-transaction">
      <div>
        <table class="unstriped" id="transaction-list">
          <thead>
            <tr>
              <th>Hash</th>
              <th>From</th>
              <th width="200">Broadcasted</th>
              <th>Nonce</th>
              <th width="200">Type</th>
              <th width="150">Status</th>
            </tr>
          </thead>
          <tbody>
            {txs}
          </tbody>
        </table>
        <div class="load-more">
          <button>Load more</button>
        </div>
        <Modal
          content={this.content()}
          modalIsOpen={this.props.modalIsOpen}
          label="Transaction information"
          modalID={this.props.modalId}
          modalClass="modal-transaction">
        </Modal>
      </div>
    </div>)
  }
}
