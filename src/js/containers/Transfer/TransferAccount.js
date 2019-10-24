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
              selectToken={this.props.selectToken}
            />
        </ToggleableMenu>
      );
    }
  }
}
