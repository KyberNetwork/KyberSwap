import React from "react"
import { connect } from "react-redux"
import * as _ from "underscore"
import Modal from 'react-modal'
import {getToken, toEther, hexToNumber} from '../utils/converter'

import TransactionCom from "./TransactionCom"
const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 10, 0.45)'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '650px'
  }
}

@connect((store) => {
  var nonceToTxs= {}
  var sortedTxs = _.sortBy(store.txs, (tx) => {
    return tx.status + "-" + tx.nonce + "-" + tx.hash
  }).reverse()
  return {
    txs: sortedTxs
  }
})
export default class Transactions extends React.Component {
  constructor() {
    super()
    this.state = {        
        modalIsOpen: false,
        presentTx : {
          data:{}
        }
    }
    this.openModal = this.openModal.bind(this)
    this.onClose = this.onClose.bind(this)
  }
  openModal(tx, event){    
    console.log(event);
    var convertedTx = tx;        

    convertedTx.gasPrice = toEther(convertedTx.gasPrice)
    convertedTx.gas = hexToNumber(convertedTx.gas)
    convertedTx.data.minConversionRate = hexToNumber(convertedTx.data.minConversionRate)
    convertedTx.data.sourceAmount = hexToNumber(convertedTx.data.sourceAmount)
    convertedTx.data.maxDestAmount = hexToNumber(convertedTx.data.maxDestAmount)

    this.setState({
        presentTx: convertedTx,
    })
    this.setState({
        modalIsOpen: true,
    })
  }

  onClose() {
     this.setState({
        modalIsOpen: false,
    })
  }

  // showDetail(){
  //   console.log("show detail");
  // }

  render() {
    var txs = this.props.txs.map((tx) =>
      <TransactionCom key={tx.hash} hash={tx.hash} click={this.openModal.bind(null,tx)}/>
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
          style={customStyles}          
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.onClose}
          contentLabel="Transaction information">
          <div id="tx-modal">
            <div class="modal-title">
              Transaction
            </div>
            <div class="modal-info">
              <div>
                <label>Nonce</label>
                <span id="nonce">{this.state.presentTx.nonce}</span>
              </div>
              <div>
                <label>From</label>
                <span>                  
                  <span id="from">
                    {this.state.presentTx.from}
                  </span>          
                </span>
              </div>
              <div>
                <label>Source token</label>
                <span>
                  {this.state.presentTx.data.sourceToken}
                </span>
              </div>
              <div>
                <label>Source amout</label>
                <span>
                  {this.state.presentTx.data.sourceAmount}
                </span>
              </div>
              <div>
                <label>Destionation address</label>
                <span>
                  {this.state.presentTx.data.destAddress}
                </span>
              </div>              
              <div>
                <label>Destionation token</label>
                <span>
                  {this.state.presentTx.data.destToken}
                </span>
              </div>
              <div>
                <label>Max destionation amount</label>
                <span>
                  {this.state.presentTx.data.maxDestAmount}
                </span>
              </div>
              <div>
                <label>Min conversion rate</label>
                <span>
                  {this.state.presentTx.data.minConversionRate}
                </span>
              </div>
              <div>
                <label>Hash</label>
                <span id="hash">
                  <a href={"https://kovan.etherscan.io/tx/" + this.state.presentTx.hash}>
                    {this.state.presentTx.hash}
                  </a>                  
                </span>
              </div>
            </div>
            <div class="modal-extra">
              <div class="left">
                <div id="gas-price">{this.state.presentTx.gasPrice} Ether</div>
                <i class="k-icon k-icon-usd"></i>
                <div>Gas Price</div>
              </div>
              <div class="right">
                <div id="gas-price">{this.state.presentTx.gas}</div>
                <div>
                  <i class="k-icon k-icon-gas"></i>  
                </div>
                
                <div>Gas</div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>)
  }
}
