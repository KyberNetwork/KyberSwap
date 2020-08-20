import React from "react"
import { connect } from "react-redux"
import * as converters from "../../utils/converter";

@connect((store, props) => {
  return {
    global: store.global
  }
})

export default class BalancePercentage extends React.Component {

  addSrcAmountByBalancePercentage = (percentage) => {
    let sourceAmount = converters.getBigNumberValueByPercentage(this.props.addressBalance, percentage);

    if (this.props.sourceTokenSymbol === 'ETH' && percentage === 100) {
      const gasLimit = this.props.gas;
      const gasPrice = converters.stringToBigNumber(converters.gweiToWei(this.props.gasPrice));
      const totalGas = converters.toT(gasPrice.multipliedBy(gasLimit));

      sourceAmount = converters.subOfTwoNumber(sourceAmount, totalGas);
      sourceAmount = sourceAmount >= 0 ? sourceAmount : 0;
    }

    this.props.changeSourceAmount(null, sourceAmount);
    this.props.global.analytics.callTrack("trackLimitOrderClickChangeSourceAmountByPercentage", percentage)
  };

  render() {
    return (
      <div className={'common__balance theme__text-2'}>
        <div className={'common__balance-item theme__button-2'} onClick={() => this.addSrcAmountByBalancePercentage(25)}>25%</div>
        <div className={'common__balance-item theme__button-2'} onClick={() => this.addSrcAmountByBalancePercentage(50)}>50%</div>
        <div className={'common__balance-item theme__button-2'} onClick={() => this.addSrcAmountByBalancePercentage(100)}>100%</div>
      </div>
    )
  }
}

