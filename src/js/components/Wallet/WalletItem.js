import React from "react"

import { Token } from "../Account/Balance"
import { ModalButton } from "../../containers/CommonElements"

import { toT } from "../../utils/converter"


const modalID = "quick-exchange-modal"
const sendModalID = "quick-send-modal"

const WalletItem = (props) => {
  var wallet = props.wallet
  var tokenList = Object.keys(wallet.tokens).map((key) => {
    return {
      name: wallet.tokens[key].name,
      balance: wallet.tokens[key].balance.toString(10),
      icon: wallet.tokens[key].icon,
    }
  })
  var tokens = tokenList.map((tok, index) => {
    return <Token key = { index } name = { tok.name } balance = { tok.balance } icon = { tok.icon }/>
  })

  var tokenRow = [];
  var rowCountItem = 3;
  var numRow = Math.round(tokens.length / rowCountItem);

  for (var i = 0; i < numRow; i++) {
    var row = [];
    for (var j = 0; j < rowCountItem; j++) {
      if (tokens[rowCountItem * i + j]) row.push(tokens[rowCountItem * i + j]);
    }
    tokenRow.push(row)
  }

  var tokenRowrender = tokenRow.map((row, index) => {
    return <div key = { index } className = 'row' > { row } < /div>
  })

  return (
    <div class="wallet-item">
      <div class="title">
        <span><span class="account-name">{wallet.name}</span> - KyberWallet for {wallet.ownerName}</span>
        <div class="control-btn">
          <button onClick={props.toggleWallet}>
            <i class="k-icon k-icon-setting"></i>
          </button>
          <div className="control-menu">
            <ul>
              <li>
                <a class="delete" onClick={(e) => props.deleteWallet(e, props.address)}>
                  <i class="k-icon k-icon-delete-green"></i> Delete...
                </a>
              </li>
              <li>
                <a class="modiy" onClick={(e) => props.openModifyModal(e, props.address, wallet.name)}>
                  <i class="k-icon k-icon-modify-green"></i> Modify...
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="wallet-content">
        <div class="wallet-left">
          <div class="content">
            <div class="balance">
              <label>Address</label>
              <span>{wallet.address}</span>
            </div>
            <div class="address">
              <label>Ether balance</label>
              <span title={toT(wallet.balance)}>{toT(wallet.balance, 8)}</span>
              <div class="account-action">
                <div>
                  <ModalButton preOpenHandler={(e) => props.openQuickExchange(e, props.address)} modalID={modalID} title="Quick exchange between tokens">
                    <i class="k-icon k-icon-exchange-green"></i>
                    <p>Exchange</p>
                  </ModalButton>
                </div>
                <div>
                  <ModalButton preOpenHandler={(e) => props.openQuickSend(e, props.address)} modalID={sendModalID} title="Quick send ethers and tokens">
                    <i class="k-icon k-icon-send-green"></i>
                    <p>Send</p>
                  </ModalButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="wallet-center">
          {tokenRowrender}
        </div>
      </div>
    </div>
  )
}

export default WalletItem