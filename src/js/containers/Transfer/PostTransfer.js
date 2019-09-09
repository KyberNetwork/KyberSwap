import React from "react"
import { connect } from "react-redux"
import * as validators from "../../utils/validators"
import * as converters from "../../utils/converter"
import * as transferActions from "../../actions/transferActions"
import { PassphraseModal, ConfirmTransferModal, PostTransferBtn } from "../../components/Transaction"
import { getTranslate } from 'react-localize-redux';
import constants from "../../services/constants"
import { ConfirmModal, BroadCastModal } from "./TransferModals"
import TermAndServices from "../CommonElements/TermAndServices";

@connect((store, props) => {
  return {
    transfer: store.transfer,
    tokens: store.tokens.tokens,
    account: store.account.account,
    ethereum: store.connection.ethereum,
    translate: getTranslate(store.locale),
    global: store.global
  };

})
export default class PostTransfer extends React.Component {
  clickTransfer = () => {

    this.props.global.analytics.callTrack("trackClickTransferButton");
    if (this.props.account === false) {
      this.props.dispatch(transferActions.openImportAccount())
      return
    }

    if (Object.keys(this.props.transfer.errors.sourceAmount).length !== 0) {
      return
    }
    if (Object.keys(this.props.transfer.errors.destAddress).length !== 0) {
      return
    }


    if (this.validateTransfer()) {
      var transferPath = [constants.TRANSFER_CONFIG.transferPath.confirm, constants.TRANSFER_CONFIG.transferPath.broadcast]
      this.props.dispatch(transferActions.updateTransferPath(transferPath, 0))
    }

  }

  validateTransfer = () => {
    var check = true
    var checkNumber = true
    if (validators.verifyAccount(this.props.transfer.destAddress.trim()) !== null) {
      this.props.dispatch(transferActions.throwErrorDestAddress(constants.TRANSFER_CONFIG.addressErrors.input, this.props.translate("error.dest_address")))
      check = false
    }

    if (isNaN(parseFloat(this.props.transfer.amount))) {
      this.props.dispatch(transferActions.throwErrorAmount(constants.TRANSFER_CONFIG.sourceErrors.input, this.props.translate("error.amount_must_be_number")))
      check = false
      checkNumber = false
    } else {
      var testBalanceWithFee = validators.verifyBalanceForTransaction(this.props.tokens['ETH'].balance,
        this.props.transfer.tokenSymbol, this.props.transfer.amount, this.props.transfer.gas, this.props.transfer.gasPrice)
      if (testBalanceWithFee) {
        this.props.dispatch(transferActions.throwErrorAmount(constants.TRANSFER_CONFIG.sourceErrors.balance, this.props.translate("error.eth_balance_not_enough_for_fee")))
        check = false
      }
    }

    if (!checkNumber) {
      return false
    }
    var amountBig = converters.stringEtherToBigNumber(this.props.transfer.amount, this.props.tokens[this.props.transfer.tokenSymbol].decimals)
    if (amountBig.isGreaterThan(this.props.tokens[this.props.transfer.tokenSymbol].balance)) {
      this.props.dispatch(transferActions.throwErrorAmount(constants.TRANSFER_CONFIG.sourceErrors.balance, this.props.translate("error.amount_transfer_too_hign")))
      check = false
    }
    return check
  }

  render() {
    let activeButtonClass = ""

    if (Object.keys(this.props.transfer.errors.sourceAmount).length === 0 && Object.keys(this.props.transfer.errors.destAddress).length === 0) {
      activeButtonClass += " active"
    }

    return (
      <div className="exchange-button">
        <div>
          {this.props.account !== false &&
            <div>
              <a className={activeButtonClass + " exchange-button__button"} onClick={this.clickTransfer} data-open="passphrase-modal">
                {this.props.translate("transaction.transfer_now") || "Transfer Now"}
              </a>
              <TermAndServices tradeType="transfer" />
              <div>
                {this.props.transfer.transferPath[this.props.transfer.currentPathIndex] === constants.TRANSFER_CONFIG.transferPath.confirm && <ConfirmModal />}
                {this.props.transfer.transferPath[this.props.transfer.currentPathIndex] === constants.TRANSFER_CONFIG.transferPath.broadcast && <BroadCastModal />}
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}
