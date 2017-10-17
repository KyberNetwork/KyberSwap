import React from "react"

import {toT} from "../../utils/converter"
import SupportedTokens from "../../services/supported_tokens"
import constants from "../../services/constants"

const ExchangeRates = (props) => {
	var ether = {
      name: "Ether",
      symbol: "ETH",
      icon: "/img/ether.png",
      address: constants.ETHER_ADDRESS
  };
  var rates = []
  var rateSymbol
  var rate
  // var rateReverse
  for (var i = 0; i < SupportedTokens.length; i++) {
    rateSymbol = SupportedTokens[i].symbol;
    rate = props.rates[rateSymbol]
    if (rate) {
      rates.push(
        <tr key={rateSymbol}>
          <td class="token-pair">{rate.symbol}</td>
          <td title={toT(rate.rate)}>{toT(rate.rate, 8)}</td>
          <td title={toT(rate.balance)}>{toT(rate.balance, 8)}</td>
        </tr>
      )
    }
  }
	return (
    <table>
      <tbody>
        {rates.length > 0 ?
          rates :
          <tr>
            <td colSpan="4" style={{textAlign: "center"}}>
              No offered rate is available!
            </td>
          </tr>
        }
      </tbody>
    </table>
  )
}
export default ExchangeRates

