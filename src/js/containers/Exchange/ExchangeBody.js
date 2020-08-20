import React from "react"
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import * as converters from "../../utils/converter"
import { ExchangeBodyLayout } from "../../components/Exchange"
import { AdvanceConfigLayout, MinConversionRate } from "../../components/TransactionCommon"
import { TokenSelector } from "../TransactionCommon"
import * as validators from "../../utils/validators"
import * as common from "../../utils/common"
import * as globalActions from "../../actions/globalActions"
import * as exchangeActions from "../../actions/exchangeActions"
import constants from "../../services/constants"
import { getTranslate } from 'react-localize-redux'
import { debounce } from 'underscore';
import BLOCKCHAIN_INFO from "../../../../env";
import ReactTooltip from 'react-tooltip';
import { ExchangeAccount } from "../../containers/Exchange"

@connect((store) => {
  const ethereum = store.connection.ethereum
  const account = store.account
  const exchange = store.exchange
  const tokens = store.tokens.tokens
  const translate = getTranslate(store.locale)
  const global = store.global
  const sourceToken = tokens[exchange.sourceTokenSymbol]
  const destToken = tokens[exchange.destTokenSymbol]

  return {
    account, ethereum, tokens, translate, 
    global, exchange, sourceToken, destToken
  }
})

class ExchangeBody extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focus: "",
    }
  }

  componentDidUpdate(prevProps) {    
    if (Object.keys(this.props.exchange.errors.sourceAmount).length > Object.keys(prevProps.exchange.errors.sourceAmount).length){      
      setTimeout(() => {
        ReactTooltip.show(document.getElementById("swap-error-trigger"))
      }, 300)
    }
  }

  componentDidMount = () => {
    if (this.props.global.changeWalletType !== "swap") this.props.dispatch(globalActions.closeChangeWallet())

    const { pathname } = this.props.history.location;
    this.updateTitle(pathname);
    this.props.dispatch(globalActions.updateTitleWithRate());

    this.props.history.listen((location, action) => {
      const { pathname } = location;
      this.updateTitle(pathname);
    })

    if (Object.keys(this.props.exchange.errors.sourceAmount).length > 0){
      setTimeout(() => {
        ReactTooltip.show(document.getElementById("swap-error-trigger"))
      }, 300)
    }
  }

  updateTitle = (pathname) => {
    let title = 'KyberSwap | Instant Exchange | No Fees';

    if (common.isAtSwapPage(pathname)) {
      let { sourceTokenSymbol, destTokenSymbol } = common.getTokenPairFromRoute(pathname);
      sourceTokenSymbol = sourceTokenSymbol.toUpperCase();
      destTokenSymbol = destTokenSymbol.toUpperCase();

      if (sourceTokenSymbol !== destTokenSymbol) {
        if (sourceTokenSymbol === "ETH") {
          title = `${destTokenSymbol}/${sourceTokenSymbol} | Swap ${sourceTokenSymbol}-${destTokenSymbol} | KyberSwap`;
        } else {
          title = `${sourceTokenSymbol}/${destTokenSymbol} | Swap ${sourceTokenSymbol}-${destTokenSymbol} | KyberSwap`;
        }
      }
    }

    document.title = title;
    this.props.dispatch(globalActions.setDocumentTitle(title));
  }

  validateTxFee = (gasPrice) => {
    if (this.props.account.account === false) {
      return
    }

    var validateWithFee = validators.verifyBalanceForTransaction(this.props.tokens['ETH'].balance, this.props.exchange.sourceTokenSymbol,
      this.props.exchange.sourceAmount, this.props.exchange.gas, gasPrice)

    if (validateWithFee) {
      this.props.dispatch(exchangeActions.throwErrorSourceAmount("error.eth_balance_not_enough_for_fee"))
    }
  }

  lazyValidateTransactionFee = debounce(this.validateTxFee, 500)

  selectSourceToken = (symbol) => {
    const sourceTokenSymbol = symbol
    const destTokenSymbol = this.props.exchange.destTokenSymbol
    const srcTokenAddress = this.props.tokens[sourceTokenSymbol].address;
    const destTokenAddress = this.props.destToken.address

    this.props.dispatch(exchangeActions.selectToken(sourceTokenSymbol, srcTokenAddress, destTokenSymbol, destTokenAddress, "source"));
    this.props.updateGlobal(sourceTokenSymbol, srcTokenAddress, destTokenSymbol, destTokenAddress);
    this.props.global.analytics.callTrack("trackChooseToken", "from", symbol);
  }

  selectDestToken = (symbol) => {
    const destTokenSymbol = symbol
    const sourceTokenSymbol = this.props.exchange.sourceTokenSymbol
    const srcTokenAddress = this.props.sourceToken.address
    const destTokenAddress = this.props.tokens[destTokenSymbol].address;

    this.props.dispatch(exchangeActions.selectToken(sourceTokenSymbol, srcTokenAddress, destTokenSymbol, destTokenAddress, "dest"));
    this.props.updateGlobal(sourceTokenSymbol, srcTokenAddress, destTokenSymbol, destTokenAddress);
    this.props.global.analytics.callTrack("trackChooseToken", "to", symbol);
  }

  dispatchUpdateRateExchange = (sourceAmount, refetchSourceAmount) => {
    var sourceTokenSymbol = this.props.exchange.sourceTokenSymbol
    
    if (sourceTokenSymbol === "ETH") {
      if (parseFloat(sourceAmount) > constants.ETH.MAX_AMOUNT) {
        this.props.dispatch(exchangeActions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.rate, this.props.translate("error.handle_amount")))
        return
      }
    } 

    var sourceToken = this.props.exchange.sourceToken
    var destToken = this.props.exchange.destToken
    var destTokenSymbol = this.props.exchange.destTokenSymbol

    this.props.dispatch(exchangeActions.updateRate(this.props.ethereum, sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, sourceAmount, true, refetchSourceAmount,constants.EXCHANGE_CONFIG.updateRateType.changeAmount));
  }

  dispatchEstimateGasNormal = () => {
    this.props.dispatch(exchangeActions.estimateGasNormal(false))
  }

  lazyUpdateRateExchange = debounce(this.dispatchUpdateRateExchange, 500)
  lazyEstimateGas = debounce(this.dispatchEstimateGasNormal, 500)

  validateRateAndSource = (sourceValue, refetchSourceAmount = false) => {
    this.lazyUpdateRateExchange(sourceValue, refetchSourceAmount)
  }

  changeSourceAmount = (e, amount) => {
    var value 
    if(e){
      value = e.target.value
    }else{
      value = amount
    }
    if (value < 0) return
    this.props.dispatch(exchangeActions.inputChange('source', value, this.props.sourceToken.decimals, this.props.destToken.decimals));

    this.lazyEstimateGas()

    this.validateRateAndSource(value)
  }

  changeDestAmount = (e, amount) => {
    var value 
    if(e){
      value = e.target.value
    }else{
      value = amount
    }
    
    if (value < 0) return
    this.props.dispatch(exchangeActions.inputChange('dest', value, this.props.sourceToken.decimals, this.props.destToken.decimals))

    var valueSource = converters.caculateSourceAmount(value, this.props.exchange.expectedRate, 6)
    this.validateRateAndSource(valueSource, true);
  }

  focusSource = () => {
    this.props.dispatch(exchangeActions.focusInput('source'));
    this.props.dispatch(exchangeActions.setIsSelectTokenBalance(false))
    this.setState({ focus: "source" })
    this.props.global.analytics.callTrack("trackClickInputAmount", "from");
  }

  blurSource = () => {
    this.setState({ focus: "" })
  }

  focusDest = () => {
    this.props.dispatch(exchangeActions.focusInput('dest'));
    this.props.dispatch(exchangeActions.setIsSelectTokenBalance(false));
    this.setState({ focus: "dest" })
    this.props.global.analytics.callTrack("trackClickInputAmount", "to");
  }

  blurDest = () => {
    this.setState({ focus: "" })
  }

  swapToken = () => {
    var isFixedDestToken = !!(this.props.account && this.props.account.account.type === "promo" && this.props.account.account.info.destToken)

    if (isFixedDestToken) {
      return
    }

    this.props.dispatch(exchangeActions.swapToken())

    const { sourceTokenSymbol, destTokenSymbol, sourceAmount, destAmount } = this.props.exchange;

    if (this.props.exchange.inputFocus === "source") {
      this.props.dispatch(exchangeActions.focusInput('dest'));
      this.props.dispatch(exchangeActions.changeAmount('source', destAmount))
      this.props.dispatch(exchangeActions.changeAmount('dest', sourceAmount))
    } else {
      this.props.dispatch(exchangeActions.focusInput('source'));
      this.props.dispatch(exchangeActions.changeAmount('source', destAmount))
      this.props.dispatch(exchangeActions.changeAmount('dest', sourceAmount))
    }

    this.props.setSrcAndDestToken(destTokenSymbol, sourceTokenSymbol, destAmount);
    this.props.global.analytics.callTrack("trackClickSwapDestSrc", sourceTokenSymbol, destTokenSymbol);
  };

  toggleAdvanceContent = () => {
    if (this.props.exchange.customRateInput.value === "" && this.props.exchange.customRateInput.isDirty) {
      this.props.dispatch(exchangeActions.setCustomRateInputError(true));
      return;
    }

    if (this.props.exchange.isAdvanceActive) {
      this.props.global.analytics.callTrack("trackClickHideAdvanceOption", "Swap")
      const expectedRate = this.props.exchange.expectedRate;

      // User basic rate 3% or custom rate
      const minRate = converters.caculatorRateToPercentage(this.props.exchange.customRateInput.isSelected ? 100 - this.props.exchange.customRateInput.value : 97, expectedRate);  
  
      this.props.dispatch(exchangeActions.setMinRate(minRate.toString()));
      this.props.dispatch(exchangeActions.setCustomRateInputError(false));
      this.props.dispatch(exchangeActions.setCustomRateInputDirty(false));
    } else {
      this.props.global.analytics.callTrack("trackClickShowAdvanceOption", "Swap")
    }
    this.props.dispatch(exchangeActions.toggleAdvanceContent());

    if (!this.props.exchange.isOpenAdvance) {
      this.props.dispatch(exchangeActions.setIsOpenAdvance());
    }
  }

  specifyGasPrice = (value) => {
    this.props.dispatch(exchangeActions.specifyGasPrice(value + ""))
    if (this.props.account !== false && !this.props.global.isChangingWallet) {
      this.lazyValidateTransactionFee(value)
    }
  }

  selectedGasHandler = (value, level, levelString) => {
    this.props.dispatch(exchangeActions.setSelectedGasPrice(value, level))
    this.specifyGasPrice(value)
    this.props.global.analytics.callTrack("trackChooseGas", "swap", value, levelString);
  }

  handleSlippageRateChanged = (e, isInput = false) => {
    if (isInput) {
      if (e.target.value === "" && this.props.exchange.customRateInput.isDirty) {
        this.props.dispatch(exchangeActions.setCustomRateInputError(true));
      } else {
        this.props.dispatch(exchangeActions.setCustomRateInputError(false));
      }
      this.props.dispatch(exchangeActions.setCustomRateInputDirty(true));
      this.props.dispatch(exchangeActions.setCustomRateInputValue(e.target.value));
    } else {
      this.props.dispatch(exchangeActions.setCustomRateInputDirty(false));
      this.props.dispatch(exchangeActions.setCustomRateInputError(false));
    }

    this.props.dispatch(exchangeActions.setIsSelectCustomRate(isInput));

    const expectedRate = this.props.exchange.expectedRate;
    let value = isInput ? 100 - e.currentTarget.value : e.currentTarget.value;

    if (value > 100) {
      value = 100;
    } else if (value < 10) {
      value = 10;
    }

    const minRate = converters.caculatorRateToPercentage(value, expectedRate);

    this.props.dispatch(exchangeActions.setMinRate(minRate.toString()));
    this.props.global.analytics.callTrack("trackSetNewMinrate", value);
  }

  getAdvanceLayout = () => {
    const minConversionRate = (
      <MinConversionRate
        isSelectToken={this.props.exchange.isSelectToken}
        minConversionRate={this.props.exchange.minConversionRate}
        expectedRate={this.props.exchange.expectedRate}
        slippageRate={this.props.exchange.slippageRate}
        onSlippageRateChanged={this.handleSlippageRateChanged}
        sourceTokenSymbol={this.props.exchange.sourceTokenSymbol}
        destTokenSymbol={this.props.exchange.destTokenSymbol}
      />
    );

    return (
      <AdvanceConfigLayout
        selectedGas={this.props.exchange.selectedGas}
        selectedGasHandler={this.selectedGasHandler}
        gasPriceSuggest={this.props.exchange.gasPriceSuggest}
        translate={this.props.translate}
        isAdvanceActive={this.props.exchange.isAdvanceActive}
        minConversionRate={minConversionRate}
        type="exchange"
      />
    )
  };

  closeChangeWallet = () => {
    this.props.dispatch(globalActions.closeChangeWallet())
  };

  acceptTerm = () => {
    this.props.dispatch(globalActions.acceptTermOfService());
  };

  selectTokenBalance = () => {
    this.props.dispatch(exchangeActions.setIsSelectTokenBalance(true));
  };

  getAddressBalance = () => {
    const token = this.props.tokens[this.props.exchange.sourceTokenSymbol];

    if (!token) return null;

    return {
      value: converters.toT(token.balance, token.decimals),
      roundingValue: converters.roundingNumber(converters.toT(token.balance, token.decimals))
    }
  };

  render() {
    var tokenDest = {}
    var isNotSupport = false
    Object.keys(this.props.tokens).map((key, i) => {
      isNotSupport = false
      if (this.props.exchange.sourceTokenSymbol === key) {
        isNotSupport = true
      }
      if (this.props.exchange.sourceTokenSymbol !== "ETH" && key !== "ETH") {
        isNotSupport = true
      }
      tokenDest[key] = { ...this.props.tokens[key], isNotSupport: isNotSupport }
    })

    var isFixedSourceToken = !!(this.props.account && this.props.account.account.type === "promo" && this.props.tokens[BLOCKCHAIN_INFO.promo_token])
    var isFixedDestToken = !!(this.props.account && this.props.account.account.type === "promo" && this.props.account.account.info.destToken)
    
    var tokenSourceSelect = (
      <TokenSelector
        type="source"
        focusItem={this.props.exchange.sourceTokenSymbol}
        listItem={this.props.tokens}
        chooseToken={this.selectSourceToken}
        isFixToken={isFixedSourceToken}
      />
    )
    var tokenDestSelect = (
      <TokenSelector
        type="dest"
        focusItem={this.props.exchange.destTokenSymbol}
        listItem={tokenDest}
        chooseToken={this.selectDestToken}
        isFixToken={isFixedDestToken}
      />
    )

    var input = {
      sourceAmount: {
        type: 'number',
        value: this.props.exchange.sourceAmount,
        onChange: this.changeSourceAmount,
        onFocus: this.focusSource,
        onBlur: this.blurSource
      },
      destAmount: {
        type: 'number',
        value: this.props.exchange.destAmount,
        onChange: this.changeDestAmount,
        onFocus: this.focusDest,
        onBlur: this.blurDest
      }
    }

    return (
      <div>
        <ExchangeBodyLayout
          exchange={this.props.exchange}
          account={this.props.account.account}
          tokenSourceSelect={tokenSourceSelect}
          tokenDestSelect={tokenDestSelect}
          input={input}
          addressBalance={this.getAddressBalance()}
          sourceTokenSymbol={this.props.exchange.sourceTokenSymbol}
          destTokenSymbol={this.props.exchange.destTokenSymbol}
          translate={this.props.translate}
          swapToken={this.swapToken}
          isAgreedTermOfService={this.props.global.termOfServiceAccepted}
          advanceLayout={this.getAdvanceLayout()}
          networkError={this.props.global.network_error}
          isChangingWallet={this.props.global.isChangingWallet}
          changeWalletType={this.props.global.changeWalletType}
          closeChangeWallet={this.closeChangeWallet}
          global={this.props.global}
          acceptTerm={this.acceptTerm}
          isAdvanceActive={this.props.exchange.isAdvanceActive}
          toggleAdvanceContent={this.toggleAdvanceContent}
          isOpenAdvance={this.props.exchange.isOpenAdvance}
          changeSourceAmount={this.changeSourceAmount}
        />

        <ExchangeAccount selectSourceToken = {this.selectSourceToken}
        selectTokenBalance = {this.selectTokenBalance}/> 
      </div>
    )
  }
}

export default withRouter(ExchangeBody);
