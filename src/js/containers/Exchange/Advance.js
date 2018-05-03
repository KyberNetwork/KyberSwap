import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as exchangeActions from "../../actions/exchangeActions"
import { MinRate } from "../Exchange"
import {AdvancedConfig} from "../../components/TransactionCommon"

import * as converters from "../../utils/converter"

@connect((store) => {
    const translate = getTranslate(store.locale)
    return {
        exchange: {...store.exchange},
        translate
    }
  })

export default class Advance extends React.Component {
    specifyGas = (event) => {
        var value = event.target.value
        this.props.dispatch(exchangeActions.specifyGas(value))
      }

  render() {
    var gasPrice = converters.stringToBigNumber(converters.gweiToEth(this.props.exchange.gasPrice))
    var totalGas = gasPrice.multipliedBy(this.props.exchange.gas + this.props.exchange.gas_approve)

    return (
        <AdvancedConfig gas={this.props.exchange.gas + this.props.exchange.gas_approve}
        gasPrice={this.props.exchange.gasPrice}
        maxGasPrice={this.props.exchange.maxGasPrice}
        gasHandler={this.specifyGas}
        gasPriceHandler={this.specifyGasPrice}
        gasPriceError={this.props.exchange.errors.gasPriceError}
        gasError={this.props.exchange.errors.gasError}
        totalGas={totalGas.toString()}
        translate={this.props.translate}
        minRate={<MinRate />}
        gasPriceSuggest={this.props.exchange.gasPriceSuggest}
        advanced={this.props.exchange.advanced}
      />
    )
  }
}
