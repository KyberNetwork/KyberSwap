import React from "react"
import { connect } from "react-redux"
import * as validators from "../../utils/validators"
import * as converters from "../../utils/converter"
import * as transferActions from "../../actions/transferActions"
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
  constructor(props) {
    super(props);
    
    this.state = {
      isValidating: false
    }
  }
  
  async clickTransfer() {
    this.props.global.analytics.callTrack("trackClickTransferButton");
    
    if (this.props.account === false) {
      this.props.dispatch(transferActions.openImportAccount())
      return
    }

    if (this.props.global.eligibleError) {
      return
    }

    if (Object.keys(this.props.transfer.errors.sourceAmount).length !== 0) {
      return
    }
    
    if (Object.keys(this.props.transfer.errors.destAddress).length !== 0) {
      return
    }
  
    this.setState({isValidating: true});
    
    const isTransferValid = await this.validateTransfer();
  
    this.setState({isValidating: false});

    if (isTransferValid) {
      var transferPath = [constants.TRANSFER_CONFIG.transferPath.confirm, constants.TRANSFER_CONFIG.transferPath.broadcast]
      this.props.dispatch(transferActions.updateTransferPath(transferPath, 0))
    }
  }

  async validateTransfer() {
    var check = true
    var checkNumber = true
    const destAddress = this.props.destAddress.trim();
  
    this.props.dispatch(transferActions.setDestEthNameAndAddress(destAddress, ''));
    
    if (!destAddress) {
      this.props.dispatch(transferActions.throwErrorDestAddress(constants.TRANSFER_CONFIG.addressErrors.input, this.props.translate("error.dest_address")))
      return false;
    }
    
    if (validators.verifyAccount(destAddress) !== null) {
      let resolvedAddress = await this.resolveEthNameToAddress(destAddress);
      
      if (resolvedAddress === constants.GENESIS_ADDRESS) {
        this.props.dispatch(transferActions.throwErrorDestAddress(constants.TRANSFER_CONFIG.addressErrors.input, this.props.translate("error.not_attached_address")))
        check = false
      } else if (!resolvedAddress) {
        this.props.dispatch(transferActions.throwErrorDestAddress(constants.TRANSFER_CONFIG.addressErrors.input, this.props.translate("error.dest_address")))
        check = false
      } else {
        this.props.dispatch(transferActions.setDestEthNameAndAddress(resolvedAddress, destAddress));
      }
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
  
  async resolveEthNameToAddress(destAddress) {
    let resolvedAddress = null;
  
    try {
      resolvedAddress = await this.props.ethereum.call("getAddressFromEthName", destAddress);
    } catch (e) {
      console.log(e);
    }
    
    return resolvedAddress
  }

  render() {
    let activeButtonClass = ""

    if (Object.keys(this.props.transfer.errors.sourceAmount).length === 0 && Object.keys(this.props.transfer.errors.destAddress).length === 0) {
      activeButtonClass += "active"
    }

    return (
      <div className="exchange-button">
        <div>
          {this.props.account !== false &&
            <div>
              <a className={`${activeButtonClass} ${this.state.isValidating ? 'disabled' : ''} exchange-button__button theme__button`} onClick={() => this.clickTransfer()} data-open="passphrase-modal">
                {this.state.isValidating ? 'Loading...' : this.props.translate("transaction.transfer_now") || "Transfer Now"}
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
