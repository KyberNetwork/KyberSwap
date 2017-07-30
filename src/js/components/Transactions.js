import React from "react"
import { connect } from "react-redux"
import * as _ from "underscore"
import Modal from './Elements/Modal'
import { openModal, setDataModal } from "../actions/utilActions"

import {getToken, toEther, hexToNumber} from '../utils/converter'

import TransactionCom from "./TransactionCom"

@connect((store) => {
  var nonceToTxs= {}
  var sortedTxs = _.sortBy(store.txs, (tx) => {
    return tx.status + "-" + tx.nonce + "-" + tx.hash
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
        convertedTx.gasPrice = toEther(convertedTx.gasPrice)
        break
      }
      case "exchange": {
        var convertedTx = tx
        convertedTx.gas = hexToNumber(convertedTx.gas)
        convertedTx.data.minConversionRate = hexToNumber(convertedTx.data.minConversionRate)
        convertedTx.data.sourceAmount = hexToNumber(convertedTx.data.sourceAmount)
        convertedTx.data.maxDestAmount = hexToNumber(convertedTx.data.maxDestAmount)
        break
      }
      case "send": {
        var convertedTx = tx
        convertedTx.gas = hexToNumber(convertedTx.gas)
        convertedTx.data.sourceAmount = hexToNumber(convertedTx.data.sourceAmount)
        break
      }
    }
    this.props.dispatch(setDataModal(this.props.modalId, convertedTx))
    this.props.dispatch(openModal(this.props.modalId))
  }

  content = () => {
    if(!this.props.utils[this.props.modalId]){
      return ""
    }
    var data = this.props.utils[this.props.modalId].data
    var content
    switch(data.type){
      case "join kyber wallet":
        content = (
           <div id="tx-modal">
            <div class="modal-title">
              Transaction
            </div>
            <div class="modal-info">
              <div>
                <label>Nonce</label>
                <span id="nonce">{data.nonce}</span>
              </div>
              <div>
                <label>From</label>
                <span>
                  <span id="from">
                    {data.from}
                  </span>
                </span>
              </div>
              <div>
                <label>Hash</label>
                <span id="hash">
                  <a href={"https://kovan.etherscan.io/tx/" + data.hash}>
                    {data.hash}
                  </a>
                </span>
              </div>
            </div>
            <div class="modal-extra">
              <div class="left">
                <div id="gas-price">{data.gasPrice} Ether</div>
                <i class="k-icon k-icon-usd"></i>
                <div>Gas Price</div>
              </div>
              <div class="right">
                <div id="gas-price">{data.gas}</div>
                <div>
                  <i class="k-icon k-icon-gas"></i>
                </div>
                <div>Gas</div>
              </div>
            </div>
          </div>
        )
        break
      case "exchange": case "send":
        content = (
          <div id="tx-modal">
            <div class="modal-title">
              Transaction
            </div>
            <div class="modal-info">
              <div>
                <label>Nonce</label>
                <span id="nonce">{data.nonce}</span>
              </div>
              <div>
                <label>From</label>
                <span>
                  <span id="from">
                    {data.from}
                  </span>
                </span>
              </div>
              <div>
                <label>Source token</label>
                <span>
                  {data.data.sourceToken}
                </span>
              </div>
              <div>
                <label>Source amout</label>
                <span>
                  {data.data.sourceAmount}
                </span>
              </div>
              <div>
                <label>Destionation address</label>
                <span>
                  {data.data.destAddress}
                </span>
              </div>
              <div>
                <label>Destionation token</label>
                <span>
                  {data.data.destToken}
                </span>
              </div>
              <div>
                <label>Max destionation amount</label>
                <span>
                  {data.data.maxDestAmount}
                </span>
              </div>
              <div>
                <label>Min conversion rate</label>
                <span>
                  {data.data.minConversionRate}
                </span>
              </div>
              <div>
                <label>Hash</label>
                <span id="hash">
                  <a href={"https://kovan.etherscan.io/tx/" + data.hash}>
                    {data.hash}
                  </a>
                </span>
              </div>
            </div>
            <div class="modal-extra">
              <div class="left">
                <div id="gas-price">{data.gasPrice} Ether</div>                
                <div>Gas Price</div>
              </div>
              <div class="right">
                <div id="gas-price">{data.gas}</div>                
                <div>Gas</div>
              </div>
            </div>
          </div>
        )
        break
    }
    return content
  }


  render() {
    var txs = this.props.txs.map((tx) =>
      <TransactionCom key={tx.hash} hash={tx.hash} click={this.showDetailInfo.bind(null,tx)}/>
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
              <th>Type</th>
              <th width="150">Status</th>
            </tr>
          </thead>
          <tbody>
            {txs}
          </tbody>
        </table>
        <Modal
          content={this.content()}
          modalIsOpen={this.props.modalIsOpen}
          label="Transaction information"
          modalID={this.props.modalId}>
          modalClass="modal-transaction"
        </Modal>
      </div>
    </div>)
  }
}
