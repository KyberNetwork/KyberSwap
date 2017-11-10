import React from "react"
import Slider from "react-slick"


import {toT} from "../../utils/converter"
import constants from "../../services/constants"

const ExchangeRates = (props) => {

  var rates = []
  var rateSymbol
  var rate
  // var rateReverse
  Object.keys(props.rates).forEach((key) => {
    rateSymbol = key
    if(rateSymbol.toLowerCase()=='eth') return;
    rate = props.rates[rateSymbol]
    if (rate) {
      rates.push(
        <div key={rateSymbol}>
          <div class="pair">{rate.symbol} / ETH</div>
          <div class="value up">{toT(rate.rate, 6)}<span>-%</span></div>
        </div>
      )
    }
  })
  // for (var i = 0; i < SupportedTokens.length; i++) {
  //   rateSymbol = SupportedTokens[i].symbol;
  //   if(rateSymbol.toLowerCase()=='eth') continue;
  //   rate = props.rates[rateSymbol]
  //   if (rate) {
  //     rates.push(
  //       // <tr key={rateSymbol}>
  //       //   <td class="token-pair">{rate.symbol}</td>
  //       //   <td title={toT(rate.rate)}>{toT(rate.rate, 8)}</td>
  //       //   <td title={toT(rate.balance)}>{toT(rate.balance, 8)}</td>
  //       // </tr>

  //       <div key={rateSymbol}>
  //         <div class="pair">ETH / {rate.symbol}</div>
  //         <div class="value up">{toT(rate.rateEth, 6)}<span>-%</span></div>
  //       </div>
  //     )
  //   }
  // }
  var settings = {    
    infinite: true,
    arrows: false,
    autoplay: true,
    speed: 500,    
    adaptiveHeight: true,
    variableWidth: true,
    responsive: [
                  { breakpoint: 400, settings: { slidesToShow: 2 } },  
                  { breakpoint: 768, settings: { slidesToShow: 3 } },                   
                  { breakpoint: 1024, settings: { slidesToShow: 5 } }, 
                  { breakpoint: 100000, settings: { slidesToShow: 6 } } ]    
  }
	return (
    <div class="row">
      <div class="column">       
        <div className="rate">
          <Slider {...settings}>
          {rates}
          </Slider>                  
        </div>         
      </div>
    </div>    
  )
}
export default ExchangeRates

