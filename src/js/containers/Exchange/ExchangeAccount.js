import React from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import { AccountBalance } from "../TransactionCommon";
import * as exchangeActions from "../../actions/exchangeActions";
import * as globalActions from "../../actions/globalActions";
import * as converters from "../../utils/converter";
import ToggleableMenu from "../CommonElements/TogglableMenu.js"

@connect((store, props) => {
  const account = store.account.account;
  const translate = getTranslate(store.locale);
  const tokens = store.tokens.tokens;
  const exchange = store.exchange;
  const ethereum = store.connection.ethereum;
  const global = store.global;
  const { walletName } = store.account;
  const sourceToken = tokens[exchange.sourceTokenSymbol]
  const destToken = tokens[exchange.destTokenSymbol]

  return {
    translate,
    exchange,
    tokens,
    account,
    ethereum,
    global,
    walletName, sourceToken, destToken
  };
})
export default class ExchangeAccount extends React.Component {
  constructor() {
    super();
  }

  selectToken = (sourceSymbol) => {
    this.props.selectSourceToken(sourceSymbol)

    var sourceBalance = this.props.tokens[sourceSymbol].balance
    var sourceDecimal = this.props.tokens[sourceSymbol].decimals
    var amount
  
    if (sourceSymbol !== "ETH") {
      amount = sourceBalance
      amount = converters.toT(amount, sourceDecimal)
      amount = amount.replace(",", "")
    } else {
      const destTokenSymbol = this.props.exchange.destTokenSymbol
      const gasLimit = this.props.tokens[destTokenSymbol].gasLimit || this.props.exchange.max_gas
      const totalGas = converters.calculateGasFee(this.props.exchange.gasPrice, gasLimit) * Math.pow(10, 18)
      
      amount = sourceBalance - totalGas * 120 / 100
      amount = converters.toEther(amount)
      amount = converters.roundingNumber(amount).toString(10)
      amount = amount.replace(",", "")
    }

    if (amount < 0) amount = 0;

    this.props.dispatch(exchangeActions.inputChange('source', amount, this.props.sourceToken.decimals, this.props.destToken.decimals))
    this.props.dispatch(exchangeActions.focusInput('source'));
    this.props.selectTokenBalance();
    this.props.global.analytics.callTrack("trackClickToken", sourceSymbol, this.props.screen);
  }

  clearSession = () => {
    this.props.dispatch(globalActions.clearSession())
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
              sourceActive={this.props.exchange.sourceTokenSymbol}
              destTokenSymbol={this.props.exchange.destTokenSymbol}
              isBalanceActive={this.props.exchange.isAdvanceActive}
              walletName={this.props.account.walletName}
              screen="swap"
              isOnDAPP={this.props.account.isOnDAPP}
              selectToken={this.selectToken}
            />
        </ToggleableMenu>
      );
    }
  }
}
