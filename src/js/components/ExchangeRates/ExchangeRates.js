import React from "react"

import {toT} from "../../utils/converter"
import SupportedTokens from "../../services/supported_tokens"
import constants from "../../services/constants"

const ExchangeRates = (props) => {
	var tokens = [{
      name: "Ether",
      symbol: "ETH",
      icon: "/img/ether.png",
      address: constants.ETHER_ADDRESS}]
    for (var i = 0; i < SupportedTokens.length; i++) {
      tokens.push({
        name: SupportedTokens[i].name,
        icon: SupportedTokens[i].icon,
        symbol: SupportedTokens[i].symbol,
        address: SupportedTokens[i].address
      })
    }
    var rates = []
    var rateID
    var rate
    var rateReverse
    for (var i = 0; i < tokens.length; i++) {
      for (var j = i + 1; j < tokens.length; j++) {
        if (i == 0 || j == 0) {
          rateID = tokens[i].address + "-" + tokens[j].address
          rate = props.rates[rateID]
          rateID = tokens[j].address + "-" + tokens[i].address
          rateReverse = props.rates[rateID]
          if (rate && rateReverse) {
            rates.push(
              <tr key={rateID}>
                <td class="token-pair">{rate.source.symbol}-{rate.dest.symbol}</td>
                <td title={toT(rate.rate)}>{toT(rate.rate, 8)}</td>
                <td class="token-pair">{rateReverse.source.symbol}-{rateReverse.dest.symbol}</td>
                <td title={toT(rateReverse.rate)}>{toT(rateReverse.rate, 8)}</td>
              </tr>
            )
          }
        }
      }
    }
	return (
    <table>
      <thead>
        <tr>
          <th width="100"></th>
          <th width="150">
            <i class="k-icon k-icon-rate"></i>
            Rate
          </th>
          <th width="100"></th>
          <th width="150">
            <i class="k-icon k-icon-rate"></i>
            Rate
          </th>
        </tr>
      </thead>
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

