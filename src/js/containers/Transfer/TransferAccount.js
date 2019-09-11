import React from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import { ImportAccount } from "../ImportAccount";
import { AccountBalance } from "../TransactionCommon";
import * as transferActions from "../../actions/transferActions";
import * as globalActions from "../../actions/globalActions";
import BLOCKCHAIN_INFO from "../../../../env";
import * as converters from "../../utils/converter";
import * as constants from "../../services/constants"
import ToggleableMenu from "../CommonElements/TogglableMenu.js"

import * as common from "../../utils/common"
import { hideSelectToken } from "../../actions/utilActions"
import constansts from "../../services/constants"

@connect((store, props) => {
  const account = store.account.account;
  const translate = getTranslate(store.locale);
  const tokens = store.tokens.tokens;
  const transfer = store.transfer;
  const ethereum = store.connection.ethereum;
  const global = store.global;
  const { walletName } = store.account;

  return {
    translate,
    transfer,
    tokens,
    account,
    ethereum,
    global,
    walletName
  };
})
export default class TransferAccount extends React.Component {
  constructor() {
    super();
  }
  
  selectToken = (sourceSymbol) => {
    this.chooseToken(sourceSymbol, this.props.tokens[sourceSymbol].address, "source")

    var sourceBalance = this.props.tokens[sourceSymbol].balance


    var sourceDecimal = this.props.tokens[sourceSymbol].decimals
    var amount

    if (sourceSymbol !== "ETH") {
        amount = sourceBalance
        amount = converters.toT(amount, sourceDecimal)
        amount = amount.replace(",", "")
    } else {            
        var gasLimit = this.props.transfer.gas
        var totalGas = converters.calculateGasFee(this.props.transfer.gasPrice, gasLimit) * Math.pow(10, 18)

        amount = sourceBalance - totalGas * 120 / 100
        amount = converters.toEther(amount)
        amount = converters.roundingNumber(amount).toString(10)
        amount = amount.replace(",", "")
    }

    if (amount < 0) amount = 0;

    this.props.dispatch(transferActions.specifyAmountTransfer(amount))

    this.selectTokenBalance();
    this.props.global.analytics.callTrack("trackClickToken", sourceSymbol, this.props.screen);
  }

  chooseToken = (symbol, address, type) => {
    this.props.dispatch(transferActions.selectToken(symbol, address))
    this.props.dispatch(hideSelectToken())

    var path = constansts.BASE_HOST + "/transfer/" + symbol.toLowerCase()

    path = common.getPath(path, constansts.LIST_PARAMS_SUPPORTED)

    this.props.dispatch(globalActions.goToRoute(path))
    this.props.global.analytics.callTrack("trackChooseToken", type, symbol);
  }

  selectTokenBalance = () => {
    this.props.dispatch(transferActions.setIsSelectTokenBalance(true));
  }

  clearSession = (e) => {
    this.props.dispatch(globalActions.clearSession(this.props.transfer.gasPrice));
    this.props.global.analytics.callTrack("trackClickChangeWallet")
  }

  render() {
    if (this.props.account === false) {
      return  null
    } else {
      return (
        <ToggleableMenu
          clearSession={this.clearSession}>
            <AccountBalance
              sourceActive={this.props.transfer.tokenSymbol}
              destTokenSymbol='ETH'
              isBalanceActive={this.props.transfer.isAdvanceActive}
              screen="transfer"
              isOnDAPP={this.props.account.isOnDAPP}
              walletName={this.props.account.walletName}
              selectToken={this.selectToken}
            />
        </ToggleableMenu>
      );
    }
  }
}
