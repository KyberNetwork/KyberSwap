import React from "react"
import { connect } from "react-redux"
import QRCode from "qrcode.react"
import { deleteWallet } from "../actions/walletActions"
import { Token } from "./Account/Balance"

@connect((store, props) => {
  var wallet = store.wallets.wallets[props.address];
  return {
    name: wallet.name,
    balance: wallet.balance.toString(10),
    desc: wallet.description,
    owner: wallet.ownerAddress,
    address: wallet.address,
    tokens: Object.keys(wallet.tokens).map((key) => {
      return {
        name: wallet.tokens[key].name,
        balance: wallet.tokens[key].balance.toString(10),
        icon: wallet.tokens[key].icon,
      }
    })
  }
})
export default class WalletDetail extends React.Component {
  deleteWallet = (event, address) => {
    event.preventDefault()
    this.props.dispatch(deleteWallet(address))        
  }
  render() {
    var tokens = this.props.tokens.map((tok, index) => {
      return <Token key={index} name={tok.name} balance={tok.balance} icon={tok.icon} />
    })
    var tokenRow  = [];
    var rowCountItem = 3;
    var numRow = Math.round(this.props.tokens.length / rowCountItem);

    for(var i = 0; i < numRow ; i ++){
      var row = [];
      for(var j=0;j<rowCountItem;j++){
        if (tokens[rowCountItem*i + j]) row.push(tokens[rowCountItem*i + j]);  
      }            
      tokenRow.push(row)
    }
    
    var tokenRowrender = tokenRow.map((row, index) => {
      return <div className='row'>{row}</div>
    })

    return (
      <div>
        <div class="wallet-item">
          <div>
            <div class="wallet-left">
              <div class="title">
                <span>{this.props.name}</span>
                <div class="control-btn">
                  <button class="k-tooltip delete" onClick={(e) => this.deleteWallet(e, this.props.address)}>
                    <i class="k-icon k-icon-delete"></i>                    
                  </button>
                  <button class="k-tooltip modiy">
                    <i class="k-icon k-icon-modify"></i>                    
                  </button>
                </div>
              </div>
              <div class="content">
                <div class="balance">
                  <label>Ether</label>
                  <span class="text-gradient">{this.props.balance}</span>
                </div>
                <div class="address">
                  <label>Address</label>
                  <span>{this.props.address}</span>
                  <div>
                    <QRCode value={this.props.address} />
                  </div>
                </div>                
              </div>
            </div>
            <div class="wallet-center">
              {tokenRowrender}
              <div class="created text-gradient">
                Created by: {this.props.owner}
              </div>
            </div>            
          </div>
        </div>
      </div>
    )
  }
}
